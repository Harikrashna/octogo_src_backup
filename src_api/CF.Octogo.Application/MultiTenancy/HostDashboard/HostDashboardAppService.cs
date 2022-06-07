using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Timing;
using Microsoft.EntityFrameworkCore;
using CF.Octogo.Authorization;
using CF.Octogo.MultiTenancy.HostDashboard.Dto;
using CF.Octogo.MultiTenancy.Payments;
using System.Data.SqlClient;
using CF.Octogo.Data;
using Newtonsoft.Json;
using Abp.Application.Services.Dto;
using static CF.Octogo.MultiTenancy.HostDashboard.Dto.CommonDashboardDataInput;

namespace CF.Octogo.MultiTenancy.HostDashboard
{
    [DisableAuditing]
    [AbpAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
    public class HostDashboardAppService : OctogoAppServiceBase, IHostDashboardAppService
    {
        private const int SubscriptionEndAlertDayCount = 30;
        private const int MaxExpiringTenantsShownCount = 10;
        private const int MaxRecentTenantsShownCount = 10;
        private const int RecentTenantsDayCount = 7;

        private readonly ISubscriptionPaymentRepository _subscriptionPaymentRepository;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IIncomeStatisticsService _incomeStatisticsService;

        public HostDashboardAppService(
            ISubscriptionPaymentRepository subscriptionPaymentRepository,
            IRepository<Tenant> tenantRepository,
            IIncomeStatisticsService incomeStatisticsService)
        {
            _subscriptionPaymentRepository = subscriptionPaymentRepository;
            _tenantRepository = tenantRepository;
            _incomeStatisticsService = incomeStatisticsService;
        }

        public async Task<TopStatsData> GetTopStatsData(GetTopStatsInput input)
        {
            return new TopStatsData
            {
                DashboardPlaceholder1 = 125,
                DashboardPlaceholder2 = 830,
                NewTenantsCount = await GetTenantsCountByDate(input.StartDate, input.EndDate),
                NewSubscriptionAmount = GetNewSubscriptionAmount(input.StartDate, input.EndDate)
            };
        }

        public async Task<GetRecentTenantsOutput> GetRecentTenantsData()
        {
            var tenantCreationStartDate = Clock.Now.ToUniversalTime().AddDays(-RecentTenantsDayCount);

            var recentTenants = await GetRecentTenantsData(tenantCreationStartDate, MaxRecentTenantsShownCount);

            return new GetRecentTenantsOutput()
            {
                RecentTenants = recentTenants,
                TenantCreationStartDate = tenantCreationStartDate,
                RecentTenantsDayCount = RecentTenantsDayCount,
                MaxRecentTenantsShownCount = MaxRecentTenantsShownCount
            };
        }

        public async Task<GetExpiringTenantsOutput> GetSubscriptionExpiringTenantsData()
        {
            var subscriptionEndDateEndUtc = Clock.Now.ToUniversalTime().AddDays(SubscriptionEndAlertDayCount);
            var subscriptionEndDateStartUtc = Clock.Now.ToUniversalTime();

            var expiringTenants = await GetExpiringTenantsData(subscriptionEndDateStartUtc, subscriptionEndDateEndUtc,
                MaxExpiringTenantsShownCount);

            return new GetExpiringTenantsOutput()
            {
                ExpiringTenants = expiringTenants,
                MaxExpiringTenantsShownCount = MaxExpiringTenantsShownCount,
                SubscriptionEndAlertDayCount = SubscriptionEndAlertDayCount,
                SubscriptionEndDateStart = subscriptionEndDateStartUtc,
                SubscriptionEndDateEnd = subscriptionEndDateEndUtc
            };
        }

        public async Task<GetIncomeStatisticsDataOutput> GetIncomeStatistics(GetIncomeStatisticsDataInput input)
        {
            return new GetIncomeStatisticsDataOutput(
                await _incomeStatisticsService.GetIncomeStatisticsData(
                    input.StartDate, 
                    input.EndDate,
                    input.IncomeStatisticsDateInterval)
            );
        }

        public async Task<GetEditionTenantStatisticsOutput> GetEditionTenantStatistics(GetEditionTenantStatisticsInput input)
        {
            return new GetEditionTenantStatisticsOutput(
                await GetEditionTenantStatisticsData(input.StartDate, input.EndDate)
            );
        }

        private async Task<List<TenantEdition>> GetEditionTenantStatisticsData(DateTime startDate, DateTime endDate)
        {
            return (await _tenantRepository.GetAll()
                .Where(t => t.EditionId.HasValue &&
                            t.IsActive &&
                            t.CreationTime >= startDate &&
                            t.CreationTime <= endDate)
                .Select(t => new { t.EditionId, t.Edition.DisplayName })
                .ToListAsync()
                )
                .GroupBy(t => t.EditionId)
                .Select(t => new TenantEdition
                {
                    Label = t.First().DisplayName,
                    Value = t.Count()
                })
                .OrderBy(t => t.Label)
                .ToList();
        }

        private decimal GetNewSubscriptionAmount(DateTime startDate, DateTime endDate)
        {
            return  _subscriptionPaymentRepository.GetAll()
                  .Where(s => s.CreationTime >= startDate &&
                              s.CreationTime <= endDate &&
                              s.Status == SubscriptionPaymentStatus.Paid)
                  .Select(x => x.Amount).AsEnumerable()
                  .Sum();
        }

        private async Task<int> GetTenantsCountByDate(DateTime startDate, DateTime endDate)
        {
            return await _tenantRepository.GetAll()
                .Where(t => t.CreationTime >= startDate && t.CreationTime <= endDate)
                .CountAsync();
        }

        private async Task<List<ExpiringTenant>> GetExpiringTenantsData(DateTime subscriptionEndDateStartUtc, DateTime subscriptionEndDateEndUtc, int? maxExpiringTenantsShownCount = null)
        {
            var query = _tenantRepository.GetAll()
                .Where(t =>
                    t.SubscriptionEndDateUtc.HasValue &&
                    t.SubscriptionEndDateUtc.Value >= subscriptionEndDateStartUtc &&
                    t.SubscriptionEndDateUtc.Value <= subscriptionEndDateEndUtc)
                .Select(t => new
                {
                    t.Name,
                    t.SubscriptionEndDateUtc
                });

            if (maxExpiringTenantsShownCount.HasValue)
            {
                query = query.Take(maxExpiringTenantsShownCount.Value);
            }

            return (await query.ToListAsync())
                .Select(t => new ExpiringTenant
                {
                    TenantName = t.Name,
                    RemainingDayCount = Convert.ToInt32(t.SubscriptionEndDateUtc.Value.Subtract(subscriptionEndDateStartUtc).TotalDays)
                })
                .OrderBy(t => t.RemainingDayCount)
                .ThenBy(t => t.TenantName)
                .ToList();
        }

        private async Task<List<RecentTenant>> GetRecentTenantsData(DateTime creationDateStart, int? maxRecentTenantsShownCount = null)
        {
            var query = _tenantRepository.GetAll()
                .Where(t => t.CreationTime >= creationDateStart)
                .OrderByDescending(t => t.CreationTime);

            if (maxRecentTenantsShownCount.HasValue)
            {
                query = (IOrderedQueryable<Tenant>)query.Take(maxRecentTenantsShownCount.Value);
            }

            return (await query.ToListAsync())
                .Select(t => ObjectMapper.Map<RecentTenant>(t))
                .ToList();
        }

        /// <summary>
        /// DESC:Get total client data for column chart widget
        /// Created by: Merajuddin khan
        /// Created on: 26-04-2022
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<List<TotalClientsDto>> GetTotalClientWithFilterForWidget(List<string> filters, DashboardInputBase input)
        {
            {

                string filterData = String.Join<string>(",", filters);
                SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter("StartDate", input.StartDate);
                parameters[1] = new SqlParameter("EndDate", input.EndDate);
                parameters[2] = new SqlParameter("Filter", filterData);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetTotalClientForWidget", parameters);
                var i = new TotalClientsDto();
                if (ds.Tables.Count > 0)
                {
                    var res = SqlHelper.ConvertDataTable<TotalClientsRet>(ds.Tables[0]);
                    var result = res.Select(rw => new TotalClientsDto
                    {
                        Name = rw.FilterName,
                        Series = rw.Data != null ? JsonConvert.DeserializeObject<List<TotalClientSeries>>(rw.Data.ToString()) : null

                    }).ToList();
                    return result;
                }
                else
                {
                    return null;
                }

            }
        }

        /// <summary>
        /// DESC:Get total revenue for column chart widget
        /// Created by: Merajuddin khan
        /// Created on: 29-04-2022
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<List<TotalRevenueDto>> GetTotalRevenueForWidget(List<string> filters, DashboardInputBase input)
        {
            {

                string filterData = String.Join<string>(",", filters);
                SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter("Filter", filterData);
                parameters[1] = new SqlParameter("StartDate", input.StartDate);
                parameters[2] = new SqlParameter("EndDate", input.EndDate);

                var ds = await SqlHelper.ExecuteDatasetAsync(
                  Connection.GetSqlConnection("DefaultOctoGo"),
                  System.Data.CommandType.StoredProcedure,
                  "USP_GetTotalRevenueForWidget", parameters);
                var i = new TotalClientsDto();
                if (ds.Tables.Count > 0)
                {
                    var res = SqlHelper.ConvertDataTable<TotalRevenueRet>(ds.Tables[0]);
                    var result = res.Select(rw => new TotalRevenueDto
                    {
                        Name = rw.FilterName,
                        Series = rw.Data != null ? JsonConvert.DeserializeObject<List<TotalRevenueSeries>>(rw.Data.ToString()) : null

                    }).ToList();
                    return result;
                }
                else
                {
                    return null;
                }

            }

        }
        /// <summary>
        /// Get pending payment details of client
        /// Created by: Merajuddin khan
        /// Created on: 29-04-2022
        /// </summary>
        /// <returns></returns>
        public async Task<PagedResultDto<PendingPaymentDto>> GetClientPendingPaymentForWidget(DashboardInputBase input)
        {
           
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("StartDate", input.StartDate);
                parameters[1] = new SqlParameter("EndDate", input.EndDate);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                        Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_GetClientPendingPaymentForWidget",parameters
                        );
                var totalCount = 0;
                var result = new List<PendingPaymentDto>();
                if (ds.Tables.Count > 0)
                {
                    var clienteResult = SqlHelper.ConvertDataTable<PendingPaymentDto>(ds.Tables[0]);
                    result = clienteResult.Select(rw => new PendingPaymentDto
                    {
                        ClientId = rw.ClientId,
                        ClientName = rw.ClientName,
                        ProductName = rw.ProductName,
                        PendingPayment =  rw.PendingPayment,
                        PendingDays = rw.PendingDays
                    }).ToList();
                    if (clienteResult != null && clienteResult.Count > 0)
                    {
                        totalCount = clienteResult.FirstOrDefault().TotalCount;
                    }

                    return new PagedResultDto<PendingPaymentDto>(
                       totalCount,
                       result
                       );
                }

                else
                {
                    return null;
                }
          
        }
    }
}
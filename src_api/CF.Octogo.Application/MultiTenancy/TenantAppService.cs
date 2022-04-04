using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Features;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Domain.Uow;
using Abp.Events.Bus;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Security;
using Microsoft.EntityFrameworkCore;
using CF.Octogo.Authorization;
using CF.Octogo.Editions.Dto;
using CF.Octogo.MultiTenancy.Dto;
using CF.Octogo.Url;
using CF.Octogo.Tenants;
using System;
using System.Data.SqlClient;
using CF.Octogo.Data;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using CF.Octogo.Authorization.Users;

namespace CF.Octogo.MultiTenancy
{
    [AbpAuthorize(AppPermissions.Pages_Tenants)]
    public class TenantAppService : OctogoAppServiceBase, ITenantAppService
    {
        public IAppUrlService AppUrlService { get; set; }
        public IEventBus EventBus { get; set; }
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly ITenantDetailsAppService _tenantDetailsService;

        public TenantAppService(ITenantDetailsAppService tenantDetailsService, IPasswordHasher<User> passwordHasher)
        {
            AppUrlService = NullAppUrlService.Instance;
            EventBus = NullEventBus.Instance;
            _tenantDetailsService = tenantDetailsService;
            _passwordHasher = passwordHasher;
        }

        public async Task<PagedResultDto<TenantListDto>> GetTenants(GetTenantsInput input)
        {
            var query = TenantManager.Tenants
                .Include(t => t.Edition)
                .WhereIf(!input.Filter.IsNullOrWhiteSpace(), t => t.Name.Contains(input.Filter) || t.TenancyName.Contains(input.Filter))
                .WhereIf(input.CreationDateStart.HasValue, t => t.CreationTime >= input.CreationDateStart.Value)
                .WhereIf(input.CreationDateEnd.HasValue, t => t.CreationTime <= input.CreationDateEnd.Value)
                .WhereIf(input.SubscriptionEndDateStart.HasValue, t => t.SubscriptionEndDateUtc >= input.SubscriptionEndDateStart.Value.ToUniversalTime())
                .WhereIf(input.SubscriptionEndDateEnd.HasValue, t => t.SubscriptionEndDateUtc <= input.SubscriptionEndDateEnd.Value.ToUniversalTime())
                .WhereIf(input.EditionIdSpecified, t => t.EditionId == input.EditionId);

            var tenantCount = await query.CountAsync();
            var tenants = await query.OrderBy(input.Sorting).PageBy(input).ToListAsync();

            return new PagedResultDto<TenantListDto>(
                tenantCount,
                ObjectMapper.Map<List<TenantListDto>>(tenants)
                );
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_Create)]
        [UnitOfWork(IsDisabled = true)]
        public async Task CreateTenant(CreateTenantInput input)
        {
            int tenantId = await TenantManager.CreateWithAdminUserAsync(input.TenancyName,
                input.Name,
                input.AdminPassword,
                input.AdminEmailAddress,
                input.ConnectionString,
                input.IsActive,
                input.EditionId,
                input.ShouldChangePasswordOnNextLogin,
                input.SendActivationEmail,
                input.SubscriptionEndDateUtc?.ToUniversalTime(),
                input.IsInTrialPeriod,
                AppUrlService.CreateEmailActivationUrlFormat(input.TenancyName)
            );
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_Edit)]
        public async Task<TenantEditDto> GetTenantForEdit(EntityDto input)
        {
            var tenantEditDto = ObjectMapper.Map<TenantEditDto>(await TenantManager.GetByIdAsync(input.Id));
            tenantEditDto.ConnectionString = SimpleStringCipher.Instance.Decrypt(tenantEditDto.ConnectionString);
            return tenantEditDto;
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_Edit)]
        public async Task UpdateTenant(TenantEditDto input)
        {
            await TenantManager.CheckEditionAsync(input.EditionId, input.IsInTrialPeriod);

            input.ConnectionString = SimpleStringCipher.Instance.Encrypt(input.ConnectionString);
            var tenant = await TenantManager.GetByIdAsync(input.Id);

            if (tenant.EditionId != input.EditionId)
            {
                await EventBus.TriggerAsync(new TenantEditionChangedEventData
                {
                    TenantId = input.Id,
                    OldEditionId = tenant.EditionId,
                    NewEditionId = input.EditionId
                });

                // _tenantDetailsService.UpdateTenantSyetemSettingForEditionUpdate((int)tenant.EditionId, input.Id);
            }

            ObjectMapper.Map(input, tenant);
            tenant.SubscriptionEndDateUtc = tenant.SubscriptionEndDateUtc?.ToUniversalTime();

            await TenantManager.UpdateAsync(tenant);
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_Delete)]
        public async Task DeleteTenant(EntityDto input)
        {
            var tenant = await TenantManager.GetByIdAsync(input.Id);
            await DeactivateTenantUsers(tenant.Id);         // Added by Hari Krashna 16/02/2022
            await TenantManager.DeleteAsync(tenant);
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_ChangeFeatures)]
        public async Task<GetTenantFeaturesEditOutput> GetTenantFeaturesForEdit(EntityDto input)
        {
            var features = FeatureManager.GetAll()
                .Where(f => f.Scope.HasFlag(FeatureScopes.Tenant));
            var featureValues = await TenantManager.GetFeatureValuesAsync(input.Id);

            return new GetTenantFeaturesEditOutput
            {
                Features = ObjectMapper.Map<List<FlatFeatureDto>>(features).OrderBy(f => f.DisplayName).ToList(),
                FeatureValues = featureValues.Select(fv => new NameValueDto(fv)).ToList()
            };
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_ChangeFeatures)]
        public async Task UpdateTenantFeatures(UpdateTenantFeaturesInput input)
        {
            await TenantManager.SetFeatureValuesAsync(input.Id, input.FeatureValues.Select(fv => new NameValue(fv.Name, fv.Value)).ToArray());
        }

        [AbpAuthorize(AppPermissions.Pages_Tenants_ChangeFeatures)]
        public async Task ResetTenantSpecificFeatures(EntityDto input)
        {
            await TenantManager.ResetAllFeaturesAsync(input.Id);
        }

        public async Task UnlockTenantAdmin(EntityDto input)
        {
            using (CurrentUnitOfWork.SetTenantId(input.Id))
            {
                var tenantAdmin = await UserManager.GetAdminAsync();
                if (tenantAdmin != null)
                {
                    tenantAdmin.Unlock();
                }
            }
        }
        /// <summary>
        /// Deactivate all users of tenant after Tenant decativation
        /// </summary>
        /// <param name="tenantId"></param>
        /// <returns></returns>
        private async Task DeactivateTenantUsers(int tenantId)
        {
            using (CurrentUnitOfWork.SetTenantId(tenantId))
            {
                var users = UserManager.Users.Select(x => x.Id).ToList();
                if (users.Count > 0)
                {
                    foreach (var userId in users)
                    {
                        var user = await UserManager.GetUserByIdAsync(userId);
                        if (user.IsDeleted == false)
                        {
                            CheckErrors(await UserManager.DeleteAsync(user));
                        }
                    }
                }
            }
        }
        [HttpPost]
        public async Task<PagedResultDto<TenantListNewDto>> GetTenantsNew(GetTenantsInputNew input)
        {
            SqlParameter[] parameters = new SqlParameter[10];
            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("TenantName", input.Filter);
            parameters[4] = new SqlParameter("ProductId", input.ProductId);
            parameters[5] = new SqlParameter("EditionId", input.EditionId);
            parameters[6] = new SqlParameter("CreationStartDt", input.CreationDateStart);
            parameters[7] = new SqlParameter("CreationEndDt", input.CreationDateEnd);
            parameters[8] = new SqlParameter("SubscriptionEndDtStart", input.SubscriptionEndDateStart);
            parameters[9] = new SqlParameter("SubscriptionEndDtEnd", input.SubscriptionEndDateEnd);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetTenantList", parameters
        );
            var tenantCount = 0;
            var tenants = new List<TenantListNewDto>();
            if (ds.Tables.Count > 0)
            {
                var tenantsRet = SqlHelper.ConvertDataTable<TenantListNewRet>(ds.Tables[0]);
                tenants = tenantsRet.Select(rw => new TenantListNewDto
                {
                    Id = rw.Id,
                    TenancyName = rw.TenancyName,
                    Name = rw.Name,
                    ConnectionString = rw.ConnectionString,
                    IsActive = rw.IsActive,
                    CreationTime = rw.CreationTime,
                    Edition = rw.Edition != null ? JsonConvert.DeserializeObject<List<SubscribedEditionDetailsDto>>(rw.Edition.ToString()) : null
                }).ToList();
                if (tenantsRet != null && tenantsRet.Count > 0)
                {
                    tenantCount = tenantsRet.FirstOrDefault().TotalCount;
                }
            }

            return new PagedResultDto<TenantListNewDto>(
                tenantCount,
                tenants
                );
        }
        /// <summary>
        /// Create Tenant by Host Admin user with Subscription and Transactional(AWB) charges
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_Tenants_Create, AppPermissions.Pages_Tenants_Edit)]
        [UnitOfWork(IsDisabled = true)]
        public async Task<int> CreateUpdateTenantNew(CreateEditTenantInputDto input)
        {
            bool IsEdit = false;
            if (input.TenantDetails.TenantId > 0)
            {
                IsEdit = true;
            }
            else
            {
                input.TenantDetails.TenantId = await TenantManager.CreateWithAdminUserAsyncNew(
                                    input.TenantDetails.ClientCode,
                                    input.TenantDetails.ClientName,
                                    input.TenantDetails.AdminPassword,
                                    input.TenantDetails.AdminEmailAddress,
                                    input.TenantDetails.FirstName,
                                    input.TenantDetails.LastName,
                                    input.TenantDetails.ConnectionString,
                                    input.TenantDetails.IsActive,
                                    input.TenantDetails.ShouldChangePasswordOnNextLogin,
                                    input.TenantDetails.SendActivationEmail,
                                    AppUrlService.CreateEmailActivationUrlFormat(input.TenantDetails.ClientCode)
                                    );
            }
            var x = JsonConvert.SerializeObject(input.PackageDetails);
            var y = JsonConvert.SerializeObject(input.TransactionCharges.AWBData);
            try
            {
                SqlParameter[] parameters = new SqlParameter[25];
                parameters[0] = new SqlParameter("TenantId", input.TenantDetails.TenantId);
                parameters[1] = new SqlParameter("PackageDetails", JsonConvert.SerializeObject(input.PackageDetails));
                parameters[2] = new SqlParameter("UserTypeId", input.TenantDetails.UserTypeID);
                parameters[3] = new SqlParameter("TenantName", input.TenantDetails.ClientName);
                parameters[4] = new SqlParameter("AirlineId", input.TenantDetails.AirlineId);
                parameters[5] = new SqlParameter("DepartmentId", input.TenantDetails.DepartmentId);
                parameters[6] = new SqlParameter("Department", input.TenantDetails.Department);
                parameters[7] = new SqlParameter("DesignationId", input.TenantDetails.DesignationId);
                parameters[8] = new SqlParameter("Designation", input.TenantDetails.Designation);
                parameters[9] = new SqlParameter("Services", input.TenantDetails.Services);
                parameters[10] = new SqlParameter("CityId", input.TenantDetails.City);
                parameters[11] = new SqlParameter("CountryId", input.TenantDetails.Country);
                parameters[12] = new SqlParameter("Contact", input.TenantDetails.Contact);
                parameters[13] = new SqlParameter("RepresentingAirlines", input.TenantDetails.RepresentingAirlines);
                parameters[14] = new SqlParameter("RepresentingCountries", input.TenantDetails.RepresentingCountries);
                parameters[15] = new SqlParameter("IndustryId", input.TenantDetails.IndustryId);
                parameters[16] = new SqlParameter("Industry", input.TenantDetails.Industry);
                parameters[17] = new SqlParameter("TransactionalApproachId", input.TransactionCharges.ApproachId);
                parameters[18] = new SqlParameter("AwbData", JsonConvert.SerializeObject(input.TransactionCharges.AWBData));
                parameters[19] = new SqlParameter("IsEdit", IsEdit);
                parameters[20] = new SqlParameter("IsActive", input.TenantDetails.IsActive);
                parameters[21] = new SqlParameter("Name", input.TenantDetails.FirstName);
                parameters[22] = new SqlParameter("Surname", input.TenantDetails.LastName);
                parameters[23] = new SqlParameter("Email", input.TenantDetails.AdminEmailAddress);
                parameters[24] = new SqlParameter("LoginUserId", AbpSession.UserId); 
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_InsertUpdateTenantWithSubscription", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (int)input.TenantDetails.TenantId;
                }
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                    return 0;
            }
            return (int)input.TenantDetails.TenantId;
        }
        [AbpAuthorize(AppPermissions.Pages_Tenants_Edit)]
        public async Task<CreateEditTenantInputDto> GetTenantDetailsForEdit(int tenantId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("TenantId", tenantId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetTenantDetailsForEdit", parameters
             );
            if (ds.Tables.Count > 0)
            {
                var TenantDataRet = SqlHelper.ConvertDataTable<CreateEditTenantInputRet>(ds.Tables[0]);
                var TenantData = TenantDataRet.Select(rw => new CreateEditTenantInputDto
                {
                    TenantDetails = rw.TenantDetails != null ? JsonConvert.DeserializeObject<List<TenantDetailsInputDto>>(rw.TenantDetails.ToString()).FirstOrDefault() : null,
                    PackageDetails = rw.PackageDetails != null ? JsonConvert.DeserializeObject<List<PackageDetailsInputDto>>(rw.PackageDetails.ToString()) : null,
                    TransactionCharges = rw.TransactionCharges != null ? JsonConvert.DeserializeObject<List<TransactionDataInputDto>>(rw.TransactionCharges.ToString()).FirstOrDefault() : null
                }).FirstOrDefault();
                return TenantData;
            }
            else
            {
                return null;
            }
        }
    }
}

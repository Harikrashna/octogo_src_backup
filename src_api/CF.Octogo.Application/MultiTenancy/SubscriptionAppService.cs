using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus;
using Abp.Runtime.Session;
using CF.Octogo.Authorization.Roles;
using CF.Octogo.Authorization.Users;
using CF.Octogo.Data;
using CF.Octogo.MultiTenancy.Dto;
using CF.Octogo.MultiTenancy.Payments;
using Newtonsoft.Json;

namespace CF.Octogo.MultiTenancy
{
    public class SubscriptionAppService : OctogoAppServiceBase, ISubscriptionAppService
    {
        public IEventBus EventBus { get; set; }
        private readonly IUserEmailer _userEmailer;
        private readonly RoleManager _roleManager;
        private readonly UserManager _userManager;
        private readonly IRepository<UserRole, long> _userRolesRepository;

        public SubscriptionAppService(IUserEmailer userEmailer, RoleManager roleManager, UserManager userManager,
            IRepository<UserRole, long> userRolesRepository)
        {                                                      
            EventBus = NullEventBus.Instance;                  
            _userEmailer = userEmailer;
            _roleManager = roleManager;
            _userManager = userManager;
            _userRolesRepository = userRolesRepository;

        }

        public async Task DisableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringAutomatic)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringManual;
                    await EventBus.TriggerAsync(new RecurringPaymentsDisabledEventData
                    {
                        TenantId = AbpSession.GetTenantId(),
                        EditionId = tenant.EditionId.Value
                    });
                }
            }
        }

        public async Task EnableRecurringPayments()
        {
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await TenantManager.GetByIdAsync(AbpSession.GetTenantId());
                if (tenant.SubscriptionPaymentType == SubscriptionPaymentType.RecurringManual)
                {
                    tenant.SubscriptionPaymentType = SubscriptionPaymentType.RecurringAutomatic;
                    tenant.SubscriptionEndDateUtc = null;

                    await EventBus.TriggerAsync(new RecurringPaymentsEnabledEventData
                    {
                        TenantId = AbpSession.GetTenantId()
                    });
                }
            }
        }
        public async Task<int> InsertEditionAddonSubscription(EditionAddonSubscriptionInputDto input)
        {
                string Remark = string.Empty;
                SqlParameter[] parameters = new SqlParameter[10];
                parameters[0] = new SqlParameter("EditionId", input.EditionId);
                parameters[1] = new SqlParameter("AddonSubscription", input.AddonSubscription != null ? JsonConvert.SerializeObject(input.AddonSubscription) : null);
                parameters[2] = new SqlParameter("PricingTypeId", input.PricingTypeId);
                parameters[3] = new SqlParameter("PaymentModeCode", input.PaymentModeCode);
                parameters[4] = new SqlParameter("PaymentType", input.PaymentType);
                parameters[5] = new SqlParameter("LoginUserId", AbpSession.UserId);
                parameters[6] = new SqlParameter("TenantId", input.TenantId);
                parameters[7] = new SqlParameter("Remark", Remark);
                parameters[8] = new SqlParameter("PaymentDone", input.PaymentDone);
                parameters[9] = new SqlParameter("Amount", input.Amount);
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                        System.Data.CommandType.StoredProcedure,
                        "USP_InsertEditionAddonSubscription", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    using (CurrentUnitOfWork.SetTenantId(input.TenantId))
                    {
                        //var userData = _userRolesRepository.GetAll().Where(obj => obj.);
                        var roleId = _roleManager.Roles.Where(obj => obj.DisplayName.ToLower() == "admin").FirstOrDefault().Id;
                        var userId = _userRolesRepository.GetAll().Where(obj => obj.RoleId == roleId).FirstOrDefault().UserId;
                        var userData = _userManager.GetUserById(userId);

                        if ((int)ds.Tables[0].Rows[0]["ProductId"] > 0)
                        {
                            string productName = (string)ds.Tables[0].Rows[0]["ProductName"];
                            _userEmailer.SendProductSelectionEmailAsync(productName, userData.EmailAddress);
                        }
                        return (int)ds.Tables[0].Rows[0]["ProductId"];
                    }
                }
                else
                {
                    return 0;
                }
        }
        /// <summary>
        /// DESC:Get Plan expiration list
        /// Created by: Merajuddin khan
        /// Created on: 29-04-2022
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<PagedResultDto<ClientSubscribedProductAndExpirationDto>> GetClientSubscriptionExpirationAndProductForWidget()
        {
            var ds = await SqlHelper.ExecuteDatasetAsync(
                    Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetPlanExpirationForWidget"
                    );
            var totalCount = 0;
            var result = new List<ClientSubscribedProductAndExpirationDto>();
            if (ds.Tables.Count > 0)
            {
                var clienteResult = SqlHelper.ConvertDataTable<ClientSubscribedProductAndExpirationRet>(ds.Tables[0]);
                 result = clienteResult.Select(rw => new ClientSubscribedProductAndExpirationDto
                {
                    ClientId = rw.ClientId,
                    ClientName = rw.ClientName,
                    ExpirationDays = rw.ExpirationDays,
                    ProductName = rw.ProductName
                }).ToList();
                if (clienteResult != null && clienteResult.Count > 0)
                {
                    totalCount = clienteResult.FirstOrDefault().TotalCount;
                }

                return new PagedResultDto<ClientSubscribedProductAndExpirationDto>(
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

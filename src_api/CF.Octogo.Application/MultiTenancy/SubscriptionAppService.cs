using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Abp.Events.Bus;
using Abp.Runtime.Session;
using CF.Octogo.Data;
using CF.Octogo.MultiTenancy.Dto;
using CF.Octogo.MultiTenancy.Payments;
using Newtonsoft.Json;

namespace CF.Octogo.MultiTenancy
{
    public class SubscriptionAppService : OctogoAppServiceBase, ISubscriptionAppService
    {
        public IEventBus EventBus { get; set; }

        public SubscriptionAppService()
        {
            EventBus = NullEventBus.Instance;
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
            bool PaymentDone = false;
            if (!AbpSession.TenantId.HasValue && AbpSession.UserId.HasValue)
            {
                Remark = "Subscription requested by Host user";
                PaymentDone = false;
            }
            else
            {
                Remark = "Subscription requested by client's user";
                PaymentDone = true;
            }
            SqlParameter[] parameters = new SqlParameter[10];
            parameters[0] = new SqlParameter("EditionId", input.EditionId);
            parameters[1] = new SqlParameter("AddonSubscription", input.AddonSubscription != null ? JsonConvert.SerializeObject(input.AddonSubscription) : null);
            parameters[2] = new SqlParameter("PricingTypeId", input.PricingTypeId);
            parameters[3] = new SqlParameter("PaymentModeCode", input.PaymentModeCode);
            parameters[4] = new SqlParameter("PaymentType", input.PaymentType);
            parameters[5] = new SqlParameter("LoginUserId", AbpSession.UserId);
            parameters[6] = new SqlParameter("TenantId", input.TenantId);
            parameters[7] = new SqlParameter("Remark", Remark);
            parameters[8] = new SqlParameter("PaymentDone", PaymentDone);
            parameters[9] = new SqlParameter("Amount", input.Amount);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_InsertEditionAddonSubscription", parameters);
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {

                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class EditionAddonSubscriptionInputDto
    {
        public int TenantId { get; set; }
        public int EditionId { get; set; }
        public int? PricingTypeId { get; set; }
        public decimal? Amount { get; set; }
        public string PaymentModeCode { get; set; }
        public int? PaymentType { get; set; }
        public bool PaymentDone { get; set; }
        public List<AddonSubscriptionDto> AddonSubscription { get; set; }
    }
    public class AddonSubscriptionDto
    {
        public int AddonId { get; set; }
        public int? PricingTypeId { get; set; }
        public decimal? Amount { get; set; }
        public string PaymentModeCode { get; set; }
        public int? PaymentType { get; set; }       // Buy/Extend
    }

    public class ClientSubscribedProductAndExpirationRet
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string ProductData { get; set; }
        public string ProductName { get; set; }
        public int ExpirationDays { get; set; }
        public int TotalCount { get; set; }
    }

    public class ClientSubscribedProductAndExpirationDto
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string ProductName { get; set; }
        public int ExpirationDays { get; set; }
  
    }
 

}

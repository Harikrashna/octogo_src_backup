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
}

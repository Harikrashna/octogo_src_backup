using CF.Octogo.Editions.Dto;

namespace CF.Octogo.MultiTenancy.Payments.Dto
{
    public class PaymentInfoDto
    {
        public EditionSelectDto Edition { get; set; }

        public decimal AdditionalPrice { get; set; }

        public bool IsLessThanMinimumUpgradePaymentAmount()
        {
            return AdditionalPrice < OctogoConsts.MinimumUpgradePaymentAmount;
        }
    }
}

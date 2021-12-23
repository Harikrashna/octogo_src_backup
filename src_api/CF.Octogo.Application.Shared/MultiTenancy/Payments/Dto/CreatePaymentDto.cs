using CF.Octogo.Editions;

namespace CF.Octogo.MultiTenancy.Payments.Dto
{
    public class CreatePaymentDto
    {
        public int EditionId { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public PaymentPeriodType? PaymentPeriodType { get; set; }

        public SubscriptionPaymentGatewayType SubscriptionPaymentGatewayType { get; set; }

        public bool RecurringPaymentEnabled { get; set; }

        public string SuccessUrl { get; set; }

        public string ErrorUrl { get; set; }
    }
    public class CreatePaymentNewDto
    {
        public int EditionId { get; set; }

        public EditionPaymentType EditionPaymentType { get; set; }

        public int? PaymentPeriodType { get; set; }

        public SubscriptionPaymentGatewayType SubscriptionPaymentGatewayType { get; set; }

        public bool RecurringPaymentEnabled { get; set; }

        public string SuccessUrl { get; set; }

        public string ErrorUrl { get; set; }
        public decimal Amount { get; set; }
    }
}

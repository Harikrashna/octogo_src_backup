using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.MultiTenancy.Payments.Dto;
using CF.Octogo.MultiTenancy.Payments.Stripe.Dto;

namespace CF.Octogo.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}
using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.MultiTenancy.Payments.PayPal.Dto;

namespace CF.Octogo.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}

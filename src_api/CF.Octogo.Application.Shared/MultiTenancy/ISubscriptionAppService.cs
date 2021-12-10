using System.Threading.Tasks;
using Abp.Application.Services;

namespace CF.Octogo.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}

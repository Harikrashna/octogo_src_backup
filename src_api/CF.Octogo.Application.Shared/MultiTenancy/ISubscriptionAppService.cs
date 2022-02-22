using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.MultiTenancy.Dto;

namespace CF.Octogo.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
        Task<int> InsertEditionAddonSubscription(EditionAddonSubscriptionInputDto input);
    }
}

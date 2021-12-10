using System.Threading.Tasks;
using Abp.Webhooks;

namespace CF.Octogo.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}

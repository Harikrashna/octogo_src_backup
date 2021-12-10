using System.Threading.Tasks;
using CF.Octogo.Authorization.Users;

namespace CF.Octogo.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}

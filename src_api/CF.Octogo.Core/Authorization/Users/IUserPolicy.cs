using System.Threading.Tasks;
using Abp.Domain.Policies;

namespace CF.Octogo.Authorization.Users
{
    public interface IUserPolicy : IPolicy
    {
        Task CheckMaxUserCountAsync(int tenantId);
    }
}

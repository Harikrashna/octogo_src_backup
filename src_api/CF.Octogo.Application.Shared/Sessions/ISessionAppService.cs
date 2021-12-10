using System.Threading.Tasks;
using Abp.Application.Services;
using CF.Octogo.Sessions.Dto;

namespace CF.Octogo.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}

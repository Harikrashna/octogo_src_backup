using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Authorization.Users.Dto;

namespace CF.Octogo.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<PagedResultDto<UserLoginAttemptDto>> GetUserLoginAttempts(GetLoginAttemptsInput input);
    }
}

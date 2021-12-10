using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Authorization.Permissions.Dto;

namespace CF.Octogo.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}

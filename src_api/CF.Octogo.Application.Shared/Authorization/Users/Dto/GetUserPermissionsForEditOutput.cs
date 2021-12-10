using System.Collections.Generic;
using CF.Octogo.Authorization.Permissions.Dto;

namespace CF.Octogo.Authorization.Users.Dto
{
    public class GetUserPermissionsForEditOutput
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}
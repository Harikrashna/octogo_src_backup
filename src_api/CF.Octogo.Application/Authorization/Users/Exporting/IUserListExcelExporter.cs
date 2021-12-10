using System.Collections.Generic;
using CF.Octogo.Authorization.Users.Dto;
using CF.Octogo.Dto;

namespace CF.Octogo.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}
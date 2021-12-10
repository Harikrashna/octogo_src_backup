using System.Collections.Generic;
using CF.Octogo.Authorization.Users.Importing.Dto;
using CF.Octogo.Dto;

namespace CF.Octogo.Authorization.Users.Importing
{
    public interface IInvalidUserExporter
    {
        FileDto ExportToFile(List<ImportUserDto> userListDtos);
    }
}

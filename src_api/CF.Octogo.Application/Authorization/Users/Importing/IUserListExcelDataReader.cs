using System.Collections.Generic;
using CF.Octogo.Authorization.Users.Importing.Dto;
using Abp.Dependency;

namespace CF.Octogo.Authorization.Users.Importing
{
    public interface IUserListExcelDataReader: ITransientDependency
    {
        List<ImportUserDto> GetUsersFromExcel(byte[] fileBytes);
    }
}

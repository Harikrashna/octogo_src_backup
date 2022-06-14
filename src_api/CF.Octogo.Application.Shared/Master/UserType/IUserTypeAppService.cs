using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.UserType.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CF.Octogo.Master.UserType
{
    public interface IUserTypeAppService : IApplicationService
    {
        Task<PagedResultDto<UserTypeListDto>> GetUserTypeList(PagedAndSortedInputDto input, string filter);
        Task<int> CreateorUpdateUserType(CreateOrUpdateUserTypeInputDto inp);
        Task DeleteUserType(EntityDto input);
        Task<DataSet> GetUserTypeById(GetEditUserTypeinput input);

    }
}

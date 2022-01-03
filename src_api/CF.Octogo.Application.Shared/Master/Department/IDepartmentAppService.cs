using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CF.Octogo.Dto;
using CF.Octogo.Master.Department.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CF.Octogo.Master.Department
{
    public interface IDepartmentAppService : IApplicationService
    {
        Task<PagedResultDto<DepartmentListDto>> GetDepartment(DepartmentListInputDto input);
        Task<int> CreateorUpdateDepartment(CreateOrUpdateDepartmentInput inp);
        Task DeleteDepartment(EntityDto input);
        Task<DataSet> GetDepartmentForEdit(EditDepartmentDto input);
        Task<DataSet> GetDepartmentByDepartmentId(int? inDepartmentID, string vcDepartmentName);
    }
}

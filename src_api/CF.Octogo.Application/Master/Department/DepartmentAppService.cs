using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using CF.Octogo.Master.Department.Dto;
using System.Threading.Tasks;


namespace CF.Octogo.Master.Department
{
    public class DepartmentAppService : OctogoAppServiceBase, IDepartmentAppService
    {
        [AbpAuthorize(AppPermissions.Pages_Administration_Department)]
        public async Task<PagedResultDto<DepartmentListDto>> GetDepartment(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<DepartmentListDto> DepartmentList = new List<DepartmentListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDepartment", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                DepartmentList = (from DataRow dr in dt.Rows
                                  select new DepartmentListDto()
                                  {
                                      inDepartmentID = Convert.ToInt32(dr["DepartmentId"]),
                                      vcDepartmentName = dr["DepartmentName"].ToString(),
                                      vcDescription = dr["Description"].ToString(),

                                  }).ToList();
                return new PagedResultDto<DepartmentListDto>(totalCount, DepartmentList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Department_CreateDepartment, AppPermissions.Pages_Administration_Department_Edit)]
        public async Task<int> CreateorUpdateDepartment(CreateOrUpdateDepartmentInput inp)
        {

            var dup_data = GetDepartmentByDepartmentId(inp.inDepartmentID, inp.vcDepartmentName, inp.vcDescription);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inDepartmentID", inp.inDepartmentID);
            parameters[1] = new SqlParameter("vcDepartmentName", inp.vcDepartmentName);
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateDepartment", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Department_Delete)]

        public async Task DeleteDepartment(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("DepartmentID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);




            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteDepartment", parameters);

        }



        public async Task<DataSet> GetDepartmentForEdit(EditDepartmentDto input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("DepartmentID", input.inDepartmentID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDepartmentById", parameters
            );
            if (ds.Tables.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }


        public async Task<DataSet> GetDepartmentByDepartmentId(int? inDepartmentID, string vcDepartmentName, string vcDescription)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("DepartmentId", inDepartmentID);
            parameters[1] = new SqlParameter("DepartmentName", vcDepartmentName);
            parameters[2] = new SqlParameter("Description", vcDescription);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateDepart", parameters
            );
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }


    }

}
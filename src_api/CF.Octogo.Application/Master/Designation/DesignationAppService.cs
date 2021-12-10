
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Master.Designation.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
namespace CF.Octogo.Master.Designation
{

    [AbpAuthorize(AppPermissions.Pages_Administration_Designation)]
    public class DesignationAppService : OctogoAppServiceBase, IDesignationService
    {
        public async Task<PagedResultDto<DesignationListDto>> GetDesignation(GetDesignationInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);

            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDesignation", parameters
            );
            if (ds.Tables.Count > 0)
            {

                var totalCount = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                DataTable dt = ds.Tables[0];
                List<DesignationListDto> DesignationList = new List<DesignationListDto>();

                DesignationList = (from DataRow dr in dt.Rows
                                   select new DesignationListDto()
                                   {
                                       Id = Convert.ToInt32(dr["id"]),
                                       DesignationName = dr["DesignationName"].ToString(),
                                       Description = dr["Description"].ToString(),
                                   }).ToList();
                return new PagedResultDto<DesignationListDto>(totalCount, DesignationList);
            }

            else
            {
                return null;
            }

        }

        public async Task InsertUpdateDesignation(CreateOrUpdateDesignationDto input)
        {
            if (input.DesignationId != 0)
            {
                var designation = GetDesignationDuplicacyCheck(input.DesignationId, input.DesignationName);

                if (designation.Result.Rows.Count > 0)
                {

                    throw new UserFriendlyException(L("DuplicateDesignationName"));

                }

                else
                {
                    await UpdateDesignationAsync(input);

                }

            }

            else
            {

                var designation = GetDesignationDuplicacyCheck(input.DesignationId, input.DesignationName);
                if (designation.Result.Rows.Count > 0)
                {
                    throw new UserFriendlyException(L("DuplicateDesignationName"));
                }

                else
                {

                    await CreateDesignationAsync(input);

                }

            }
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Create)]
        protected virtual async Task<int> CreateDesignationAsync(CreateOrUpdateDesignationDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("DesignationId", input.DesignationId);
            parameters[1] = new SqlParameter("DesignationName", input.DesignationName);
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginBy", AbpSession.UserId);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_InsertUpdateDesignation", parameters);

            return 1;

        }

        public async Task<DataTable> GetDesignationDuplicacyCheck(int? designationId, string designationName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("DesignationId", designationId);
            parameters[1] = new SqlParameter("DesignationName", designationName);


            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetDesignationDuplicacyCheck", parameters
            );
            return ds.Tables[0];
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Edit)]
        protected virtual async Task<int> UpdateDesignationAsync(CreateOrUpdateDesignationDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("DesignationId", input.DesignationId);
            parameters[1] = new SqlParameter("DesignationName", input.DesignationName);
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginBy", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
                    System.Data.CommandType.StoredProcedure, "USP_InsertUpdateDesignation", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {

                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 1;
            }

        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Designation_Delete)]
        public async Task<string> DeleteDesignation(int designationId)
        {
            {
                SqlParameter[] parameters ={
                     new SqlParameter("@DesignationId", designationId),
                     new SqlParameter("@LoginBy", AbpSession.UserId)
                };
                await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
                System.Data.CommandType.StoredProcedure,
                "USP_DeleteDesignation", parameters);
                return "Success";
            }
        }


    }
}
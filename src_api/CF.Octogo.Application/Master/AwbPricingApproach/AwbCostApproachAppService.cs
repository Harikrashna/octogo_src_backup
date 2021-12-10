using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using CF.Octogo.Data;
using System.Data;
using System.Data.SqlClient;
using CF.Octogo.Master.AwbPricingAppoach;
using CF.Octogo.Master.AwbPricingAppoach.Dto;
using Abp.Authorization;
using CF.Octogo.Authorization;
using CF.Octogo.Dto;
using Abp.UI;

namespace CF.Octogo.Master.AwbPricingApproach
{
    public class AwbCostApproachAppService : OctogoAppServiceBase, IAwbCostApproachAppService
    {
        public async Task<PagedResultDto<AwbCostApproachListDto>> GetPerAWBCostApproach(PagedAndSortedInputDto input, string Filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", Filter);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPerAWBCostApproach", parameters
            );
            if (ds.Tables.Count > 0)
            {
                var totalCount = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                DataTable dt = ds.Tables[0];
                List<AwbCostApproachListDto> AwbCostApproachList = new List<AwbCostApproachListDto>();
                AwbCostApproachList = (from DataRow dr in dt.Rows
                                       select new AwbCostApproachListDto()
                                       {
                                           inApproachID = Convert.ToInt32(dr["id"]),
                                           vcApproachName = dr["ApproachName"].ToString(),
                                           vcDescription = dr["Description"].ToString(),

                                       }).ToList();
                return new PagedResultDto<AwbCostApproachListDto>(totalCount, AwbCostApproachList);
            }
            else
            {
                return null;
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_AwbCostApproach_Create, AppPermissions.Pages_Administration_AwbCostApproach_Edit)]
        public async Task<int> CreateOrUpdateAwbCostType(CreateOrUpdateAwbCostApproachInput input)
        {
            var dup_data = GetAwbCostApproachDuplicacy(input.inApproachID, input.vcApproachName, input.vcDescription);
            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inApproachID", input.inApproachID);
            parameters[1] = new SqlParameter("vcApproachName", input.vcApproachName);
            parameters[2] = new SqlParameter("vcDescription", input.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);


            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CreateOrUpdateAwbCostApproach", parameters);
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_AwbCostApproach_Edit)]
        public async Task<DataSet> GetPerAwbCostApproachForEdit(GetEditAwbCostApproachInput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("AwbCostApproachId", input.inApproachID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetAwbCostApproachId", parameters
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
        [AbpAuthorize(AppPermissions.Pages_Administration_AwbCostApproach_Delete)]
        public async Task DeleteAwbCostApproach(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AwbCostApproachId", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteAwbCostApproach", parameters);
        }
        public async Task<DataSet> GetAwbCostApproachDuplicacy(int? inApproachID, string vcApproachName, string vcDescription)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("ApproachId", inApproachID);
            parameters[1] = new SqlParameter("ApproachName", vcApproachName);
            parameters[2] = new SqlParameter("Description", vcDescription);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckAwbCostApproachDuplicateData", parameters
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

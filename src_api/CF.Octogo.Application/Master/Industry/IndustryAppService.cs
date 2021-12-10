using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.Industry.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Industry
{
    public class IndustryAppService : OctogoAppServiceBase, IIndustryAppService
    {
        [AbpAuthorize(AppPermissions.Pages_Administration_Industry)]
        public async Task<PagedResultDto<IndustryListDto>> GetIndustry(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<IndustryListDto> IndustryList = new List<IndustryListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetIndustry", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                IndustryList = (from DataRow dr in dt.Rows
                                select new IndustryListDto()
                                {
                                    inIndustryID = Convert.ToInt32(dr["IndustryId"]),
                                    vcIndustryName = dr["IndustryName"].ToString(),
                                    vcDescription = dr["Description"].ToString(),

                                }).ToList();
                return new PagedResultDto<IndustryListDto>(totalCount, IndustryList);
            }
            else
            {
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Industry_CreateIndustry, AppPermissions.Pages_Administration_Industry_Edit)]
        public async Task<int> CreateorUpdateIndustry(CreateOrUpdateIndustryInput inp)
        {

            var dup_data = GetIndustryByIndustryId(inp.inIndustryID, inp.vcIndustryName, inp.vcDescription);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inIndustryID", inp.inIndustryID);
            parameters[1] = new SqlParameter("vcIndustryName", inp.vcIndustryName);
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateIndustry", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Industry_Delete)]

        public async Task DeleteIndustry(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("IndustryID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);




            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteIndustry", parameters);

        }



        public async Task<DataSet> GetIndustryForEdit(GetEditIndustryinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("IndustryID", input.inIndustryID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetIndustryById", parameters
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


        public async Task<DataSet> GetIndustryByIndustryId(int? inIndustryID, string vcIndustryName, string vcDescription)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("IndustryId", inIndustryID);
            parameters[1] = new SqlParameter("IndustryName", vcIndustryName);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateIndustry", parameters
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


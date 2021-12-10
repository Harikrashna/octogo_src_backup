using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.PricingApproach;
using CF.Octogo.Master.PricingApproach.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace CF.Octogo.Master.PricingApproach
{
    [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach)]
    public class PriceApproachAppService : OctogoAppServiceBase, IPriceApproachService
    {
        public async Task<PagedResultDto<PriceApproachListDto>> GetPricingApproach(GetPriceApproachInput input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);

            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingApproach", parameters
            );
            if (ds.Tables.Count > 0)
            {

                var totalCount = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                DataTable dt = ds.Tables[0];
                List<PriceApproachListDto> PricingApproachList = new List<PriceApproachListDto>();

                PricingApproachList = (from DataRow dr in dt.Rows
                                       select new PriceApproachListDto()
                                       {
                                           Id = Convert.ToInt32(dr["id"]),
                                           ApproachName = dr["ApproachName"].ToString(),
                                           Description = dr["Description"].ToString(),
                                       }).ToList();
                return new PagedResultDto<PriceApproachListDto>(totalCount, PricingApproachList);
            }

            else
            {
                return null;
            }


        }

        public async Task InsertUpdatePricingApproach(CreateOrUpdatePriceApproachDto input)
        {
            if (input.ApproachId != 0)
            {
                var PricingApproach = GetPricingApproachDuplicateCheck(input.ApproachId, input.ApproachName);

                if (PricingApproach.Result.Rows.Count > 0)
                {

                    throw new UserFriendlyException(L("DuplicateApproachName"));

                }

                else
                {
                    await UpdatePriceApproachAsync(input);
                }

            }

            else
            {

                var PricingApproach = GetPricingApproachDuplicateCheck(input.ApproachId, input.ApproachName);
                if (PricingApproach.Result.Rows.Count > 0)
                {
                    throw new UserFriendlyException(L("DuplicateApproachName"));
                }

                else
                {

                    await CreatePriceApproachAsync(input);

                }

            }
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach_Create)]
        protected virtual async Task<int> CreatePriceApproachAsync(CreateOrUpdatePriceApproachDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("ApproachId", input.ApproachId);
            parameters[1] = new SqlParameter("ApproachName", input.ApproachName);
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginBy", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_InsertUpdatePricingApproach", parameters);


            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {

                return (int)ds.Tables[0].Rows[0]["Id"];

            }
            else
            {
                return 1;
            }

        }

        public async Task<DataTable> GetPricingApproachDuplicateCheck(int? ApproachId, string ApproachName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("ApproachName", ApproachName);
            parameters[1] = new SqlParameter("ApproachId", ApproachId);


            DataSet ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingApproachDuplicacyCheck", parameters
            );
            return ds.Tables[0];
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach_Edit)]
        protected virtual async Task<int> UpdatePriceApproachAsync(CreateOrUpdatePriceApproachDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("ApproachId", input.ApproachId);
            parameters[1] = new SqlParameter("ApproachName", input.ApproachName);
            parameters[2] = new SqlParameter("Description", input.Description);
            parameters[3] = new SqlParameter("LoginBy", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_InsertUpdatePricingApproach", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 1;
            }

        }


        [AbpAuthorize(AppPermissions.Pages_Administration_PriceApproach_Delete)]
        public async Task<string> DeletePricingApproach(int ApproachId)
        {
            {
                SqlParameter[] parameters ={
                     new SqlParameter("@ApproachId",(ApproachId)),
                     new SqlParameter("@LoginBy",  AbpSession.UserId)
                };
                await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_DeletePricingApproach", parameters);
                return "Success";
            }
        }


    }
}

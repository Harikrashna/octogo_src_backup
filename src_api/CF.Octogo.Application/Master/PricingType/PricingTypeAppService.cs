using System;
using Abp.Application.Services.Dto;
using CF.Octogo.Data;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using CF.Octogo.Authorization;
using CF.Octogo.Dto;
using Abp.UI;
using CF.Octogo.Master.PricingType;
using CF.Octogo.Master.PricingType.Dto;


namespace CF.Octogo.Master.PricingType
{

    [AbpAuthorize(AppPermissions.Pages_Administration_PricingType)]
    public class PricingTypeAppService : OctogoAppServiceBase, IPricingTypeAppService
    {
        List<PricingTypeListDto> list = new List<PricingTypeListDto>();


        public async Task<PagedResultDto<PricingTypeListDto>> GetPricingType(PricingListInputDto inp)
        {

            SqlParameter[] parameters = new SqlParameter[4];

            parameters[0] = new SqlParameter("MaxResultCount", inp.MaxResultCount);
            parameters[1] = new SqlParameter("SkipCount", inp.SkipCount);
            parameters[2] = new SqlParameter("Sort", inp.Sorting);
            parameters[3] = new SqlParameter("Filter", inp.filter);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingTypes", parameters
            );
            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;


                DataTable dt = ds.Tables[0];


                list = (from DataRow dr in dt.Rows
                        select new PricingTypeListDto()
                        {
                            inPricingTypeId = Convert.ToInt32(dr["PricingTypeId"]),
                            vcTypeName = dr["TypeName"].ToString(),
                            inNoOfDays = Convert.ToInt32(dr["NoOfDays"])
                        }).ToList();



                return new PagedResultDto<PricingTypeListDto>(totalCount, list);
            }
            else
            {
                return null;
            }
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_CreatePricingType, AppPermissions.Pages_Administration_EditPricingType)]
        public async Task<int> InsertUpdatePricingType(CreateorUpdatePricingType inp)
        {


            var duplicateList = GetPricingTypeByPricingId(inp.inPricingTypeId, inp.vcTypeName, inp.inNoOfDays);

            if (duplicateList.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }


            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PricingTypeId", inp.inPricingTypeId);
            parameters[1] = new SqlParameter("TypeName", inp.vcTypeName);
            parameters[2] = new SqlParameter("NoOfDays", inp.inNoOfDays);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);




            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CreateUpdatePricingType", parameters);
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }


        }


        [AbpAuthorize(AppPermissions.Pages_Administration_DeletePricingType)]

        public async Task DeletePricingType(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("PricingTypeId", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);

            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeletePricingType", parameters);

        }



        public async Task<DataSet> GetPricingTypeForEdit(int inPricingTypeId)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("PricingTypeId", inPricingTypeId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingTypebyId", parameters
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

        public async Task<DataSet> GetPricingTypeByPricingId(int? inPricingTypeId, string vcTypeName, int inNoOfDays)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("PricingTypeId", inPricingTypeId);
            parameters[1] = new SqlParameter("TypeName", vcTypeName);
            parameters[2] = new SqlParameter("NoOfDays", inNoOfDays);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicacyRecord", parameters
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

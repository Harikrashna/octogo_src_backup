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
using Abp.Runtime.Caching;

namespace CF.Octogo.Master.PricingType
{

    [AbpAuthorize(AppPermissions.Pages_Administration_PricingType)]
    public class PricingTypeAppService : OctogoAppServiceBase, IPricingTypeAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public PricingTypeAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        List<PricingTypeListDto> list = new List<PricingTypeListDto>();


        public async Task<PagedResultDto<PricingTypeListDto>> GetPricingType(PricingListInputDto input)
        {

            SqlParameter[] parameters = new SqlParameter[4];

            parameters[0] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[1] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[2] = new SqlParameter("Sorting", input.Sorting);
            parameters[3] = new SqlParameter("Filter", input.filter);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingTypesListOrPricingTypeForEdit", parameters ); // Change procedure name "USP_GetPricingTypebyId" to "USP_GetPricingTypesListOrPricingTypeForEdit"
            if (ds.Tables.Count > 0)
            {

                var totalCount = 0;

                var pricingTypeListDto = SqlHelper.ConvertDataTable<PricingTypeListRet>(ds.Tables[0]);

                var pricingTypeList = new List<PricingTypeListDto>();
                pricingTypeList = pricingTypeListDto.Select(rw => new PricingTypeListDto
                {
                    inPricingTypeId = rw.PricingTypeId,
                    inNoOfDays = rw.NoOfDays,
                    vcTypeName = rw.TypeName
                }).ToList();
                if (pricingTypeList != null && pricingTypeList.Count > 0)
                {
                    totalCount = pricingTypeListDto.FirstOrDefault().TotalCount;

                }

                return new PagedResultDto<PricingTypeListDto>(totalCount, pricingTypeList);



                return new PagedResultDto<PricingTypeListDto>(totalCount, list);
            }
            else
            {
                return null;
            }
        }


        //[AbpAuthorize(AppPermissions.Pages_Administration_CreatePricingType, AppPermissions.Pages_Administration_EditPricingType)]
        //public async Task<int> InsertUpdatePricingType(CreateorUpdatePricingType inp)
        //{


        //    var duplicateList = GetPricingTypeByPricingId(inp.inPricingTypeId, inp.vcTypeName, inp.inNoOfDays);

        //    if (duplicateList.Result != null)
        //    {
        //        throw new UserFriendlyException(L("DuplicateRecord"));
        //    }


        //    SqlParameter[] parameters = new SqlParameter[4];
        //    parameters[0] = new SqlParameter("PricingTypeId", inp.inPricingTypeId);
        //    parameters[1] = new SqlParameter("TypeName", inp.vcTypeName.Trim());
        //    parameters[2] = new SqlParameter("NoOfDays", inp.inNoOfDays);
        //    parameters[3] = new SqlParameter("UserId", AbpSession.UserId);




        //    var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
        //    System.Data.CommandType.StoredProcedure,
        //    "USP_CreateUpdatePricingType", parameters);
        //    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //    {
        //        await ClearCache();
        //        return (int)ds.Tables[0].Rows[0]["Id"];
        //    }
        //    else
        //    {
        //        return 0;
        //    }


        //}


        [AbpAuthorize(AppPermissions.Pages_Administration_CreatePricingType, AppPermissions.Pages_Administration_EditPricingType)]
        public async Task<int> InsertUpdatePricingType(CreateorUpdatePricingType inp)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("PricingTypeId", inp.inPricingTypeId);
            parameters[1] = new SqlParameter("TypeName", inp.vcTypeName.Trim());
            parameters[2] = new SqlParameter("NoOfDays", inp.inNoOfDays);
            parameters[3] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CreateOrUpdateOrDeletePricingType", parameters);// Change procedure name "USP_CreateUpdatePricingType" to "USP_CreateOrUpdateOrDeletePricingType"

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (string)ds.Tables[0].Rows[0]["Message"] == "DuplicateRecord" && (int)ds.Tables[0].Rows[0]["Id"] == 0)
            {

                throw new UserFriendlyException(L("DuplicateRecord"));
            }
            else if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (string)ds.Tables[0].Rows[0]["Message"] == "Success" && (int)ds.Tables[0].Rows[0]["Id"] > 0)
            {
                await ClearCache();
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
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("PricingTypeId", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);


            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeletePricingType", parameters); // Change procedure name "USP_DeletePricingType" to "USP_CreateOrUpdateOrDeletePricingType"
            await ClearCache();
        }



        public async Task<DataSet> GetPricingTypeById(int inPricingTypeId)
        {
            SqlParameter[] parameters = new SqlParameter[2];

            parameters[0] = new SqlParameter("PricingTypeId", inPricingTypeId);
            parameters[1] = new SqlParameter("IsEdit", true);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPricingTypesListOrPricingTypeForEdit", parameters); // Change procedure name "USP_GetPricingTypebyId" to "USP_GetPricingTypesListOrPricingTypeForEdit"
            if (ds.Tables.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }

        //public async Task<DataSet> GetPricingTypeByPricingId(int? inPricingTypeId, string vcTypeName, int inNoOfDays)
        //{
        //    SqlParameter[] parameters = new SqlParameter[3];
        //    parameters[0] = new SqlParameter("PricingTypeId", inPricingTypeId);
        //    parameters[1] = new SqlParameter("TypeName", vcTypeName);
        //    parameters[2] = new SqlParameter("NoOfDays", inNoOfDays);

        //    var ds = await SqlHelper.ExecuteDatasetAsync(
        //    Connection.GetSqlConnection("DefaultOctoGo"),
        //    System.Data.CommandType.StoredProcedure,
        //    "USP_CheckDuplicacyRecord", parameters ); 
        //    if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
        //    {
        //        return ds;
        //    }
        //    else
        //    {
        //        return null;
        //    }
        //}
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }

    }
}

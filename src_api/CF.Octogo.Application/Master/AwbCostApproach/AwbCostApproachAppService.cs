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
using Abp.Runtime.Caching;
using Newtonsoft.Json;

namespace CF.Octogo.Master.AwbPricingApproach
{
    public class AwbCostApproachAppService : OctogoAppServiceBase, IAwbCostApproachAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public AwbCostApproachAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        public async Task<PagedResultDto<AwbCostApproachListDto>> GetPerAWBCostApproach(PagedAndSortedInputDto input, string Filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[2] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[3] = new SqlParameter("Filter", Filter);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPerAWBCostApproachList", parameters
            );
            var totalCount = 0;
            var awbList = new List<AwbCostApproachListDto>();
            if (ds.Tables.Count > 0)
            {
                awbList = SqlHelper.ConvertDataTable<AwbCostApproachListDto>(ds.Tables[0]);
                if (awbList != null && awbList.Count > 0)
                {
                    totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                }
            }
            return new PagedResultDto<AwbCostApproachListDto>(
                totalCount,
                awbList
            );
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_AwbCostApproach_Create, AppPermissions.Pages_Administration_AwbCostApproach_Edit)]
        public async Task<int> CreateOrUpdateAwbCostType(CreateOrUpdateAwbCostApproachInput input)

        {
            // var x = JsonConvert.SerializeObject(input.AWBCostAppraochData);
            SqlParameter[] parameters = new SqlParameter[5];
            parameters[0] = new SqlParameter("inApproachID", input.inApproachID);
            parameters[1] = new SqlParameter("vcApproachName", input.vcApproachName);
            parameters[2] = new SqlParameter("vcDescription", input.vcDescription);
            parameters[3] = new SqlParameter("AWBCostAppraochData", JsonConvert.SerializeObject(input.AWBCostAppraochData));
            parameters[4] = new SqlParameter("UserId", AbpSession.UserId);

            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CreateOrUpdateOrDeleteAwbCostApproach", parameters);
            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                await ClearCache();
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }

        public async Task<CreateOrUpdateAwbCostApproachInput> GetPerAwbCostApproachById(GetEditAwbCostApproachInput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("inApproachID", input.inApproachID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetPerAWBCostApproachList", parameters //USP_GetAwbCostApproachId
            );
            if (ds.Tables.Count > 0)
            {
                var AwbDataRet = SqlHelper.ConvertDataTable<CreateOrUpdateAwbCostApproachInputRet>(ds.Tables[0]);
                var AwbData = AwbDataRet.Select(rw => new CreateOrUpdateAwbCostApproachInput
                {
                    inApproachID = rw.inApproachID,
                    vcApproachName = rw.vcApproachName,
                    vcDescription = rw.vcDescription,
                    AWBCostAppraochData = rw.AWBCostAppraochData != null ? JsonConvert.DeserializeObject<List<AwbCostApproachDto>>(rw.AWBCostAppraochData.ToString()) : null,

                }).FirstOrDefault();
                return AwbData;
            }
            else
            {
                return null;
            }
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_AwbCostApproach_Delete)]
        public async Task DeleteAwbCostApproach(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inApproachID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteAwbCostApproach", parameters);
            await ClearCache();

        }

        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }
    }
}

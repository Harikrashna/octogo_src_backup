using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Runtime.Caching;
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
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public IndustryAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Industry)]
        public async Task<PagedResultDto<IndustryListDto>> GetIndustry(PagedAndSortedInputDto input, string filter)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[2] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[3] = new SqlParameter("Filter", filter);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetIndustryList", parameters
            );

            var totalCount = 0;
            var industryList = new List<IndustryListDto>();
            if (ds.Tables.Count > 0)
            {
                industryList = SqlHelper.ConvertDataTable<IndustryListDto>(ds.Tables[0]);
                if (industryList != null && industryList.Count > 0)
                {
                    totalCount = Convert.ToInt32(ds.Tables[0].Rows[0]["TotalCount"]);
                }
            }
            return new PagedResultDto<IndustryListDto>(
                totalCount,
                industryList
            );
        }

        public async Task<int> CreateorUpdateIndustry(CreateOrUpdateIndustryInput inp)
        {
            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inIndustryID", inp.inIndustryID);
            parameters[1] = new SqlParameter("vcIndustryName", inp.vcIndustryName.Trim());
            parameters[2] = new SqlParameter("vcDescription", inp.vcDescription);
            parameters[3] = new SqlParameter("LoginUserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteIndustry", parameters);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 && (int)ds.Tables[0].Rows[0]["Id"] == 0)
            {
                throw new UserFriendlyException(L((string)ds.Tables[0].Rows[0]["Message"]));
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
        [AbpAuthorize(AppPermissions.Pages_Administration_Industry_Delete)]
        public async Task DeleteIndustry(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("inIndustryID", input.Id);
            parameters[1] = new SqlParameter("LoginUserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteIndustry", parameters);
            await ClearCache();
        }
        public async Task<DataSet> GetIndustryById(GetEditIndustryinput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("IndustryID", input.inIndustryID);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetIndustryList", parameters
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
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }


    }

}


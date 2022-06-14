using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Runtime.Caching;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.Country.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Country
{
    public class CountryAppService : OctogoAppServiceBase, ICountryAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public CountryAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Country)]
        public async Task<PagedResultDto<CountryListDto>> GetCountry(PagedAndSortedInputDto input, string filter)
        {

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("PageSize", input.MaxResultCount);
            parameters[2] = new SqlParameter("PageNo", (input.SkipCount / input.MaxResultCount) + 1);
            parameters[3] = new SqlParameter("Filter", filter);
            List<CountryListDto> CountryList = new List<CountryListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetCountryList", parameters
            );
            var totalCount = 0;
            var countryList = new List<CountryListDto>();
            if (ds.Tables.Count > 0)
            {
                var countryRet = SqlHelper.ConvertDataTable<CountryListRet>(ds.Tables[0]);
                countryList = countryRet.Select(rw => new CountryListDto
                {
                    SNo = rw.SNo,
                    CountryCode = rw.CountryCode,
                    CountryName = rw.CountryName,
                    CurrencyCode = rw.CurrencyCode,
                    Continent = rw.Continent
                }).ToList();
                if (countryRet != null && countryRet.Count > 0)
                {
                    totalCount = countryRet.FirstOrDefault().TotalCount;
                }
            }
            return new PagedResultDto<CountryListDto>(
                totalCount,
                countryList
            );
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Country_Create, AppPermissions.Pages_Administration_Country_Edit)]
        public async Task<int> CreateorUpdateCountry(CreateOrUpdateCountryInput inp)
        {
            try
            {

                SqlParameter[] parameters = new SqlParameter[10];
                parameters[0] = new SqlParameter("SNo", inp.SNo);
                parameters[1] = new SqlParameter("CountryName", inp.CountryName);
                parameters[2] = new SqlParameter("CurrencySNo", inp.CurrencySNo);
                parameters[3] = new SqlParameter("CountryCode", inp.CountryCode);
                parameters[4] = new SqlParameter("ISDCode", inp.ISDCode);
                parameters[5] = new SqlParameter("CurrencyCode", inp.CurrencyCode);
                parameters[6] = new SqlParameter("Continent", inp.Continent);
                parameters[7] = new SqlParameter("IATAAreaCode", inp.IATAAreaCode);
                parameters[8] = new SqlParameter("Nationality", inp.Nationality);
                parameters[9] = new SqlParameter("UserId", AbpSession.UserId);


                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
               System.Data.CommandType.StoredProcedure,
               "USP_CreateOrUpdateOrDeleteCountry", parameters);
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
            catch (Exception e)
            {
                Console.WriteLine(e);
                return 0;
            }




        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Country_Delete)]

        public async Task DeleteCountry(EntityDto input)
        {

            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("SNo", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            parameters[2] = new SqlParameter("IsDelete", true);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateOrDeleteCountry", parameters);


        }


        public async Task<DataSet> GetCountryById(GetEditCountryInput input)
        {

            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("SNo", input.SNo);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetCountryList", parameters
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

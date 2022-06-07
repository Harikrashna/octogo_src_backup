using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Data.SqlClient;
using System.Threading.Tasks;
using CF.Octogo.Data;
using CF.Octogo.Master.Airline.Dto;
using Abp.Runtime.Caching;

namespace CF.Octogo.Master.Airline
{
    public class AirlineAppService : OctogoAppServiceBase, IAirlineAppService
    {
        private const string masterCacheKey = OctogoCacheKeyConst.MasterDataCacheKey;
        private readonly ICacheManager _cacheManager;

        public AirlineAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        //[AbpAuthorize(AppPermissions.Pages_Administration_Airline)]
        public async Task<PagedResultDto<AirlineListDto>> GetAirline(PagedAndSortedInputDto input, string filter)
        {
            try
            {
                SqlParameter[] parameters = new SqlParameter[4];
                parameters[0] = new SqlParameter("Sorting", input.Sorting);
                parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
                parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
                parameters[3] = new SqlParameter("Filter", filter);
                List<AirlineListDto> AirlineList = new List<AirlineListDto>();
                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
                System.Data.CommandType.StoredProcedure,
                "USP_GetAirline", parameters
                );
                var totalCount = 0;
                var airlineList = new List<AirlineListDto>();
                if (ds.Tables.Count > 0)
                {
                    airlineList = SqlHelper.ConvertDataTable<AirlineListDto>(ds.Tables[0]);
                    DataRow row = ds.Tables[1].Rows[0];
                    totalCount = Convert.ToInt32(row["totalCount"]);
                }
                return new PagedResultDto<AirlineListDto>(
                    totalCount,
                    airlineList
                );
            }

            catch (Exception e)
            {
                Console.WriteLine(e);
                return null;
            }
        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Create, AppPermissions.Pages_Administration_Airline_Edit)]
        public async Task<int> CreateorUpdateAirline(CreateOrUpdateAirlineInput inp)
        {

            var dup_data = GetAirlineByAirlineId(inp.inAirlineID, inp.vcAirlineName);
            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("inAirlineID", inp.inAirlineID);
            parameters[1] = new SqlParameter("vcAWBPrifix", inp.vcAWBPrifix);
            parameters[2] = new SqlParameter("vcCarrierCode", inp.vcCarrierCode);
            parameters[3] = new SqlParameter("vcAirlineName", inp.vcAirlineName);
            parameters[4] = new SqlParameter("vcICAOCode", inp.vcICAOCode);
            parameters[5] = new SqlParameter("vcCountryName", inp.vcCountryName);
            parameters[6] = new SqlParameter("vcAirport", inp.vcAirport);
            parameters[7] = new SqlParameter("vcRegisteredAddress", inp.vcRegisteredAddress);
            parameters[8] = new SqlParameter("vcContactPerson", inp.vcContactPerson);
            parameters[9] = new SqlParameter("vcMobileNo", inp.vcMobileNo);
            parameters[10] = new SqlParameter("vcPhoneNo", inp.vcPhoneNo);
            parameters[11] = new SqlParameter("vcFaxNo", inp.vcFaxNo);
            parameters[12] = new SqlParameter("isCheckModulus7", inp.isCheckModulus7);
            parameters[13] = new SqlParameter("vcAWBDuplicacy", inp.vcAWBDuplicacy);
            parameters[14] = new SqlParameter("vcHandlingInformation", inp.vcHandlingInformation);
            parameters[15] = new SqlParameter("isInterline", inp.isInterline);
            parameters[16] = new SqlParameter("vcAirlineWebsite", inp.vcAirlineWebsite);
            parameters[17] = new SqlParameter("isInvoiceGeneration", inp.isInvoiceGeneration);
            parameters[18] = new SqlParameter("isCCShipment", inp.isCCShipment);
            parameters[19] = new SqlParameter("isPartShipment", inp.isPartShipment);
            parameters[20] = new SqlParameter("isFSUTime", inp.isFSUTime);
            parameters[21] = new SqlParameter("isIncludeInFFM", inp.isIncludeInFFM);
            parameters[22] = new SqlParameter("vcCIMPGrossWeight", inp.vcCIMPGrossWeight);
            parameters[23] = new SqlParameter("vcCIMPCBM", inp.vcCIMPCBM);
            parameters[24] = new SqlParameter("isActive", inp.isActive);
            parameters[25] = new SqlParameter("vcAirlineLogo", inp.vcAirlineLogo);
            parameters[26] = new SqlParameter("vcAWBLogo", inp.vcAWBLogo);

            parameters[27] = new SqlParameter("UserId", AbpSession.UserId);
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("Default"),
           System.Data.CommandType.StoredProcedure,
           "USP_CreateOrUpdateAirline", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }

        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Delete)]
        public async Task DeleteAirline(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AirlineID", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);
            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteAirline", parameters);
            await ClearCache();
        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Airline_Edit)]
        public async Task<DataSet> GetAirlineForEdit(GetEditAirlineinput input)
        {

            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("AirlineId", input.inAirlineId);
            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetAirline", parameters
            );
            if (ds.Tables.Count > 0)
            {
                Console.WriteLine(ds);
                return ds;
            }
            else
            {
                return null;
            }




        }


        public async Task<DataSet> GetAirlineByAirlineId(int? inAirlineID, string vcAirlineName)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("AirlineId", inAirlineID);
            parameters[1] = new SqlParameter("AirlineName", vcAirlineName);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("Default"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateRecord", parameters
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
        public async Task ClearCache()
        {
            var allMasterCache = _cacheManager.GetCache(masterCacheKey);
            await allMasterCache.ClearAsync();
        }

    }
}



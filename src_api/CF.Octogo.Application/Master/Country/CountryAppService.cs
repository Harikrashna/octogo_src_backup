using Abp.Application.Services.Dto;
using Abp.Authorization;
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
        [AbpAuthorize(AppPermissions.Pages_Administration_Country)]
        public async Task<PagedResultDto<CountryListDto>> GetCountry(PagedAndSortedInputDto input, string filter)
        {

            SqlParameter[] parameters = new SqlParameter[4];
            parameters[0] = new SqlParameter("Sorting", input.Sorting);
            parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
            parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
            parameters[3] = new SqlParameter("Filter", filter);
            List<CountryListDto> CountryList = new List<CountryListDto>();
            var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetCountryList", parameters
            );

            if (ds.Tables.Count > 0)
            {
                int v = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                var totalCount = v;
                DataTable dt = ds.Tables[0];

                CountryList = (from DataRow dr in dt.Rows
                               select new CountryListDto()
                               {
                                   SNo = Convert.ToInt32(dr["SNo"]),
                                   CountryCode = dr["CountryCode"].ToString(),
                                   CountryName = dr["CountryName"].ToString(),
                                   CurrencyCode = dr["CurrencyCode"].ToString(),
                                   Continent = dr["Continent"].ToString(),
                               }).ToList();
                return new PagedResultDto<CountryListDto>(totalCount, CountryList);
            }
            else
            {
                return null;
            }




        }



        [AbpAuthorize(AppPermissions.Pages_Administration_Country_Create, AppPermissions.Pages_Administration_Country_Edit)]
        public async Task<int> CreateorUpdateCountry(CreateOrUpdateCountryInput inp)
        {
            var dup_data = GetCountryByCountryId(inp.SNo, inp.CountryName, inp.CountryCode);

            if (dup_data.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

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
           "USP_CreateOrUpdateCountry", parameters);





            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                return (int)ds.Tables[0].Rows[0]["Id"];
            }
            else
            {
                return 0;
            }



        }
        [AbpAuthorize(AppPermissions.Pages_Administration_Country_Delete)]

        public async Task DeleteCountry(EntityDto input)
        {
            SqlParameter[] parameters = new SqlParameter[2];
            parameters[0] = new SqlParameter("SNo", input.Id);
            parameters[1] = new SqlParameter("UserId", AbpSession.UserId);




            await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
           System.Data.CommandType.StoredProcedure,
           "USP_DeleteCountry", parameters);

        }


        [AbpAuthorize(AppPermissions.Pages_Administration_Country_Edit)]
        public async Task<DataSet> GetCountryForEdit(GetEditCountryInput input)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("SNo", input.SNo);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_GetCountryById", parameters
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


        public async Task<DataSet> GetCountryByCountryId(int? SNo, string CountryName, string CountryCode)
        {
            SqlParameter[] parameters = new SqlParameter[3];
            parameters[0] = new SqlParameter("SNo", SNo);
            parameters[1] = new SqlParameter("CountryName", CountryName);
            parameters[2] = new SqlParameter("CountryCode", CountryCode);

            var ds = await SqlHelper.ExecuteDatasetAsync(
            Connection.GetSqlConnection("DefaultOctoGo"),
            System.Data.CommandType.StoredProcedure,
            "USP_CheckDuplicateCountry", parameters
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

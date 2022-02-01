using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.UI;
using CF.Octogo.Authorization;
using CF.Octogo.Data;
using CF.Octogo.Dto;
using CF.Octogo.Master.City.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master
{
    public class CityAppService : OctogoAppServiceBase, ICityAppService
        {
            public async Task<PagedResultDto<CityListDto>> GetCityList(PagedAndSortedInputDto input, string Filter)
        {

                SqlParameter[] parameters = new SqlParameter[4];
                parameters[0] = new SqlParameter("Sorting", input.Sorting);
                parameters[1] = new SqlParameter("MaxResultCount", input.MaxResultCount);
                parameters[2] = new SqlParameter("SkipCount", input.SkipCount);
                parameters[3] = new SqlParameter("Filter", Filter);

                var ds = await SqlHelper.ExecuteDatasetAsync(
                Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_GetCityList", parameters
                );
                if (ds.Tables.Count > 0)
                {
                    var totalCount = Convert.ToInt32(ds.Tables[1].Rows[0]["totalCount"]);
                    DataTable dt = ds.Tables[0];
                    List<CityListDto> CityList = new List<CityListDto>();
                    CityList = (from DataRow dr in dt.Rows
                                select new CityListDto()
                                {
                                    SNo = Convert.ToInt32(dr["SNo"]),
                                    CityCode = dr["CityCode"].ToString(),
                                    CityName = dr["CityName"].ToString(),
                                    StateName = dr["StateName"].ToString(),
                                    CountryName = dr["CountryName"].ToString(),
                                    PriorApproval = Convert.ToBoolean(string.IsNullOrEmpty(dr["PriorApproval"].ToString()) ? 0 : dr["PriorApproval"]),
                                    IsDayLightSaving = Convert.ToBoolean(string.IsNullOrEmpty(dr["IsDayLightSaving"].ToString()) ? 0 : dr["IsDayLightSaving"]),
                                    IsActive = Convert.ToBoolean(dr["IsActive"])
                                }).ToList();
                    return new PagedResultDto<CityListDto>(totalCount, CityList);
                }
                else
                {
                    return null;
                }

        }
        private async Task<DataSet> CheckCityDuplicacy(int? SNo, string CityName, string CityCode)
            {
                SqlParameter[] parameters = new SqlParameter[3];
                parameters[0] = new SqlParameter("SNo", SNo);
                parameters[1] = new SqlParameter("CityName", CityName);
                parameters[2] = new SqlParameter("CityCode", CityCode);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_CheckCityDuplicacy", parameters
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
            [AbpAuthorize(AppPermissions.Pages_Administration_City_Create, AppPermissions.Pages_Administration_City_Edit)]
            public async Task<int> CreateOrUpdateCityType(CreateOrUpdateCityInput input)
        {
            var Duplicacy = CheckCityDuplicacy(input.SNo, input.CityName, input.CityCode);

            if (Duplicacy.Result != null)
            {
                throw new UserFriendlyException(L("DuplicateRecord"));
            }

                SqlParameter[] parameters = new SqlParameter[18];
                parameters[0] = new SqlParameter("SNo", input.SNo);
                parameters[1] = new SqlParameter("CityCode", input.CityCode);
                parameters[2] = new SqlParameter("CityName", input.CityName);
                //parameters[3] = new SqlParameter("ZoneName", input.ZoneName);
                parameters[3] = new SqlParameter("StateSNo", input.StateSNo);
                parameters[4] = new SqlParameter("CountryName", input.CountryName);
                parameters[5] = new SqlParameter("PriorApproval", input.PriorApproval);
                parameters[6] = new SqlParameter("IsDayLightSaving", input.IsDayLightSaving);
                parameters[7] = new SqlParameter("IsActive", input.IsActive);
                parameters[8] = new SqlParameter("TimeZoneSNo", input.TimeZoneSNo);
                parameters[9] = new SqlParameter("ZoneSNo", input.ZoneSNo);
                parameters[10] = new SqlParameter("IataAreaCode", input.IataAreaCode);
                parameters[11] = new SqlParameter("ShcSNo", input.ShcSNo);
                parameters[12] = new SqlParameter("DgClassSNo", input.DgClassSNo);
                parameters[13] = new SqlParameter("UserId", AbpSession.UserId);
                parameters[14] = new SqlParameter("StateName", input.StateName);
                parameters[15] = new SqlParameter("ZoneName", input.ZoneName);
                parameters[16] = new SqlParameter("CountryCode", input.CountryCode);
                parameters[17] = new SqlParameter("CountrySNo", input.CountrySNo);

                var ds = await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_CreateOrUpdateCity", parameters);
                if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    return (int)ds.Tables[0].Rows[0]["SNo"];
                }
                else
                {
                    return 0;
                }
        }
        [AbpAuthorize(AppPermissions.Pages_Administration_City_Edit)]
            public async Task<DataSet> GetCityForEdit(GetEditCityInput input)
            {
                SqlParameter[] parameters = new SqlParameter[1];
                parameters[0] = new SqlParameter("SNo", input.SNo);
                var ds = await SqlHelper.ExecuteDatasetAsync(
                Connection.GetSqlConnection("DefaultOctoGo"),
                System.Data.CommandType.StoredProcedure,
                "USP_GetCityById", parameters
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
            [AbpAuthorize(AppPermissions.Pages_Administration_City_Delete)]
            public async Task DeleteCity(EntityDto input)
            {
                SqlParameter[] parameters = new SqlParameter[2];
                parameters[0] = new SqlParameter("SNo", input.Id);
                parameters[1] = new SqlParameter("UserId", AbpSession.UserId);

                await SqlHelper.ExecuteDatasetAsync(Connection.GetSqlConnection("DefaultOctoGo"),
               System.Data.CommandType.StoredProcedure,
               "USP_DeleteCity", parameters);
            }
        }
}

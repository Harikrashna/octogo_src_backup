/// CREATE BY: HARI KRASHNA
/// CREATED ON: 10/12/2021
/// 

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp.Runtime.Security;
using CF.Octogo.Common.Dto;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using CF.Octogo.Data;
using Abp.Runtime.Caching;
using System.Collections;

namespace CF.Octogo.Common
{
    public class CommonAppService : OctogoAppServiceBase, ICommonAppService
    {
        private readonly ICacheManager _cacheManager;
        public CommonAppService(ICacheManager cacheManager)
        {
            _cacheManager = cacheManager;
        }
        public IList<MasterDataDto> GetMasterData_Cache(string Name)
        {

            string cacheKey = (Name != null && Name != "") ?  Name.Trim().ToUpper() : "MasterDataKey_All";
            var cache = _cacheManager.GetCache(OctogoCacheKeyConst.MasterDataCacheKey);       // create cache if not created before
            var cache_result = cache.GetOrDefault(cacheKey);        // get caching data
            try
            {
                if (cache_result == null)                               // check cache data
            {
                cache.SetAsync(cacheKey, GetMasterData(Name));    // create cache keys and set data in cache
                cache_result = cache.GetOrDefault(cacheKey);            // get caching data
            }
                IList<MasterDataDto> objectList = cache_result as IList<MasterDataDto>;
                return objectList;
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return null;
        }

        /// <summary>
        /// 1. Pricing Types :- MasterName = 'PRICINGTYPE'
        /// 2. Pricing Approach :- MasterName = 'PRICINGAPPROACH'
        /// 3. Awb Cost Approach :- MasterName = 'AWBCOSTAPPROACH'
        /// 4. Product :- MasterName = 'PRODUCT'
        /// 5. Services :- MasterName = 'SERVICE'
        /// 6. User Type :- MasterName = 'USERTYPE'
        /// 7. Department :- MasterName = 'DEPARTMENT'
        /// 8. Airline :- MasterName = 'AIRLINE'
        /// 9. Industry :- MasterName = 'INDUSTRY'
        /// 10. Designation  :- MasterName = 'DESIGNATION'
        /// 11. City  :- MasterName = 'CITY'
        /// 12. Country  :- MasterName = 'COUNTRY'
        /// </summary>
        /// <param name="masterName"></param>
        /// <returns></returns>
        public List<MasterDataDto> GetMasterData(string masterName)
        {
            SqlParameter[] parameters = new SqlParameter[1];
            parameters[0] = new SqlParameter("MasterName", masterName);
            var ds = SqlHelper.ExecuteDataset(Connection.GetSqlConnection("DefaultOctoGo"),
                    System.Data.CommandType.StoredProcedure,
                    "USP_GetMasterDataByMasterName", parameters);
            if (ds.Tables.Count > 0)
            {
                var result = SqlHelper.ConvertDataTable<MasterDataRet>(ds.Tables[0]);
                return result.Where(o => o.MasterName != "" && o.MasterName != null)
                 .Select(rw => new MasterDataDto
                {
                    MasterName = rw.MasterName,
                    MasterData = rw.MasterData != null ? JsonConvert.DeserializeObject<List<object>>(rw.MasterData.ToString()) : null
                }).ToList();

            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Decript Cipher Query string(Browser). Extract data and return to user as key-value pairs
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public List<CommonNameValueDto> SimpleStringDecription(string str)
        {
                List<CommonNameValueDto> lst = new List<CommonNameValueDto>();
                str = SimpleStringCipher.Instance.Decrypt(str);
                bool flag = false;
                CommonNameValueDto record = new CommonNameValueDto();
                foreach (var ch in str)
                {
                    if (flag == false)
                    {
                        record = new CommonNameValueDto();
                        record.Key = "";
                        record.Value = null;
                        flag = true;
                    }
                    if (ch != '&')
                    {
                        if (ch != '=')
                        {
                            if (record.Value == null)
                            {
                                record.Key = record.Key + ch;
                            }
                            else
                            {
                                record.Value = record.Value + ch;
                            }
                        }
                        else
                        {
                            record.Value = "";
                        }
                    }
                    else
                    {
                        lst.Add(record);
                        flag = false;
                    }
                }
                lst.Add(record);
                return lst;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Abp.Runtime.Security;
using CF.Octogo.Common.Dto;

namespace CF.Octogo.Common
{
    public class CommonAppService : OctogoAppServiceBase, ICommonAppService
    {
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

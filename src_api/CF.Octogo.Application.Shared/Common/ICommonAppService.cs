/// CREATE BY: HARI KRASHNA
/// CREATED ON: 10/12/2021
/// 
using Abp.Application.Services;
using CF.Octogo.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Common
{
    public interface ICommonAppService: IApplicationService
    {
        List<MasterDataDto> GetMasterData(string masterName);
        IList<MasterDataDto> GetMasterData_Cache(string Name);
        List<CommonNameValueDto> SimpleStringDecription(string str);
    }
}

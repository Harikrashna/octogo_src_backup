using Abp.Application.Services;
using CF.Octogo.Common.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Common
{
    public interface ICommonAppService: IApplicationService
    {
         List<CommonNameValueDto> SimpleStringDecription(string str);
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Common.Dto
{
    public class MasterDataRet
    {
        public string MasterName { get; set; }
        public string MasterData { get; set; }
    }
    public class MasterDataDto
    {
        public string MasterName { get; set; }
        public List<object> MasterData { get; set; }
    }
}

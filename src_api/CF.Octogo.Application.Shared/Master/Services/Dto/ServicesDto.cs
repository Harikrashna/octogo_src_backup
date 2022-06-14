using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Services.Dto
{
    public class ServicesDto
    {
        public class ServicesListRet
        {
            public int ServiceId { get; set; }
            public string ServiceName{ get; set; }
            public string Description { get; set; }
            public int TotalCount { get; set; }
        }
        public class ServicesListDto
        {
            public int InServiceID { get; set; }
            public string VcServiceName { get; set; }
            public string VcDescription { get; set; }

        }

    }
}

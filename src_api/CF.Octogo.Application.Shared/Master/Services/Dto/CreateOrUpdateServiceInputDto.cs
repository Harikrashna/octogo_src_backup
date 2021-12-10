using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.Services.Dto
{
    public class CreateOrUpdateServiceInputDto
    {
        public class CreateOrUpdateServiceInput
        {
            public Nullable<int> inServiceID { get; set; }
            public string vcServiceName { get; set; }
            public string vcDescription { get; set; }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.UserType.Dto
{
    public class CreateOrUpdateUserTypeInputDto
    {

            public Nullable<int> inUserTypeID { get; set; }
            public string vcUserTypeName { get; set; }
            public string vcDescription { get; set; }
    }
}

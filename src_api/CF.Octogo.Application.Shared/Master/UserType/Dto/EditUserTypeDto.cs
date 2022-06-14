using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.Master.UserType.Dto
{

        public class GetEditUserTypeinput
        {
            public int inUserTypeID { get; set; }
        }
    public class UserTypeListRet
    {
        public int UserTypeId { get; set; }
        public string UserTypeName { get; set; }
        public string Description { get; set; }
        public int TotalCount { get; set; }
    }

    public class UserTypeListDto
    {
        public int inUserTypeID { get; set; }
        public string vcUserTypeName { get; set; }
        public string vcDescription { get; set; }
    }
}

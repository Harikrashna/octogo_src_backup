using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Department.Dto
{
    public class CreateOrUpdateDepartmentInput
    {
        public Nullable<int> inDepartmentID { get; set; }
        public string vcDepartmentName { get; set; }
        public string vcDescription { get; set; }
    }
}

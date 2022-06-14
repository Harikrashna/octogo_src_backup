using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Designation.Dto
{

    public class DesignationListRet
    {
        public int Id { get; set; }
        public string DesignationName { get; set; }

        public string Description { get; set; }
        public int TotalCount { get; set; }

    }
    public class DesignationListDto
    {
        public int Id { get; set; }
        public string DesignationName { get; set; }

        public string Description { get; set; }

    }
}




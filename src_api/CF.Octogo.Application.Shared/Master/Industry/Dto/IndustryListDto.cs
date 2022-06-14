using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Industry.Dto
{
    public class IndustryListDto
    {
        public int inIndustryID { get; set; }
        public string vcIndustryName { get; set; }
        public string vcDescription { get; set; }
    }
    public class IndustryListRet
    {
        public int inIndustryID { get; set; }
        public string vcIndustryName { get; set; }
        public string vcDescription { get; set; }
        public int TotalCount { get; set; }
    }
}

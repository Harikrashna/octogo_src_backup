using Abp.Runtime.Validation;
using CF.Octogo.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Department.Dto
{
    public class DepartmentListDto
    {
        public int inDepartmentID { get; set; }
        public string vcDepartmentName { get; set; }
        public string vcDescription { get; set; }
    }
    public class DepartmentListRet
    {
        public int inDepartmentID { get; set; }
        public string vcDepartmentName { get; set; }
        public string vcDescription { get; set; }
        public int TotalCount { get; set; }
    }
    public class DepartmentListInputDto : PagedAndSortedInputDto, IShouldNormalize
    {
        public string filter { get; set; }
        public void Normalize()
        {
            filter = filter?.Trim();
        }

    }
}

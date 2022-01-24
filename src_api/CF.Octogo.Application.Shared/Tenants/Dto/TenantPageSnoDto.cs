using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Tenants.Dto
{
    public class TenantPageSnoListDto
    {
        public int PageSno { get; set; }
        public int? ParentSno { get; set; }
        public string PageName { get; set; }
    }
    public class TenantProductInputDto
    {
        public int TenantId { get; set; }
        public int ProductId { get; set; }
    }
    public class UserProductInputDto
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}

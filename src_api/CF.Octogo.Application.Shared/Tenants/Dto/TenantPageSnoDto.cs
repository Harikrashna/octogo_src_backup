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
    public class PageDetailsWithProduct
    {
        public int PackageID { get; set; }
        public int TenantID { get; set; }
        public List<PageDetails> PageDetails { get; set; }
    }
    public class PageDetails
    {
        public int PageSno { get; set; }
    }
}

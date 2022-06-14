using System;
using System.Collections.Generic;

namespace CF.Octogo.Product.Dto
{

    public class ProductListRet
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int TotalCount { get; set; }
    }

    public class ProductListDto
    {
        public int InProductID { get; set; }
        public string VcProductName { get; set; }
        public string VcDescription { get; set; }
    }

    public class CreateOrUpdateProductInput
    {
        public Nullable<int> inProductID { get; set; }
        public string vcProductName { get; set; }
        public string vcDescription { get; set; }
        public string SelectedPageIds { get; set; }
        public string userTypes { get; set; }
    }
    public class GetEditProductinput
    {
        public int inProductID { get; set; }
    }
    public class ProductUserTypeEditDto
    {
        public int UserTypeId { get; set; }
        public bool CanEdit { get; set; }
    }
    public class ProductandUserEdit
    {
        public int inProductID { get; set; }
        public string vcProductName { get; set; }
        public string vcDescription { get; set; }
        public List<ProductUserTypeEditDto> UserTypes { get; set; }
    }
    public class ProductandUserRet
    {
        public int inProductID { get; set; }
        public string vcProductName { get; set; }
        public string vcDescription { get; set; }
        public string UserTypes { get; set; }
    }
    public class ProductModuleSubModuleDto
    {
        public List<ProductPageModulesDto> ModuleList { get; set; }
        public List<ProductSubModulesDto> SubModuleList { get; set; }
    }
    public class ProductPageModulesDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string SubModuleList { get; set; }
        public bool? selected { get; set; }
    }
    public class ProductSubModulesRet
    {
        public int ModuleId { get; set; }
        public string SubModuleList { get; set; }
        public bool? selected { get; set; }
    }
    public class ProductSubModulesDto
    {
        public int ModuleId { get; set; }
        public bool? selected { get; set; }
        public List<ProductSubModuleListDto> SubModuleList { get; set; }
    }
    public class ProductSubModuleListDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public bool? selected { get; set; }
        public List<ProductSubSubModuleListDto> SubSubModuleList { get; set; }
    }
    public class ProductSubSubModuleListDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
    }
}

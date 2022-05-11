using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Product.Dto
{
    class ProductModuleListForView
    {
    }
    public class ProductModulesDto
    {
        public int ModuleId { get; set; }
        public string DisplayName { get; set; }
        public List<ProductSubModuleDto> SubModuleList { get; set; }
    }
    public class ProductSubModuleDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public List<ProductSubSubModuleDto> SubSubModuleList { get; set; }
    }
    public class ProductSubSubModuleDto
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
    }


    public class ProductModuleRet
    {
        public int ModuleId { get; set; }
        public string DisplayName { get; set; }
        public string SubModuleList { get; set; }
    }
    public class ProductListByUserType
    {
        public int Id { get; set; }
        public string Name { get; set; }


    }
}

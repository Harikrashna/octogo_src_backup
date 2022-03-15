using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Product.Dto
{
    public class ProductModuleListDto
    {
        public int? ProductModuleId { get; set; }
        public int? PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<ProductModuleListDto> SubModuleList { get; set; }
    }
}

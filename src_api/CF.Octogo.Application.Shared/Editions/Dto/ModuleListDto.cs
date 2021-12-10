using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class ModuleListDto
    {
        public int? EditionModuleId { get; set; }
        public int? PageModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<ModuleListDto> SubModuleList { get; set; }
    }
}

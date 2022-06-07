using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.DashboardCustomization.Dto
{
    public class AWBCountsDto
    {
        public int AwbTypeId { get; set; }
        public string Name { get; set; }
        public int Value { get; set; } = 0;
    }
    public class AWBCountsResultDto
    {
        public string Name { get; set; }
        public int Value { get; set; } = 0;
    }
}

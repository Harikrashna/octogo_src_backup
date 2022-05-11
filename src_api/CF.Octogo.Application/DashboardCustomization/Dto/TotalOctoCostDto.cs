using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.DashboardCustomization.Dto
{
   
        public class TotalOctoCostDto
        {
            public string Name { get; set; }
            public List<TotalOctoCostSeries> Series { get; set; }
        }
        public class TotalOctoCostSeries
        {
            public string Name { get; set; }
            public double Value { get; set; }
        }
        public class TotalOctoCostRet
        {
            public string FilterName { get; set; }
            public string Data { get; set; }
        }
    
}

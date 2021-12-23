using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.DashboardCustomization.Dto
{
    public class EditionAndProductListDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public string ProductUrl { get; set; }

        public int EditionId { get; set; }


        public string EditionName { get; set; }


        public int? ListModule { get; set; }
    }
}

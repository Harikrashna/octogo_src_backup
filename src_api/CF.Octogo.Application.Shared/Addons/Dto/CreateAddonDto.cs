using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Editions.Dto
{
    public class CreateAddonDto
    {
        public List<PriceDiscount> priceDiscount { get; set; } = null;
        public int? EditionID { get; set; }
        public int ProductId { get; set; }
        public int ApproachId { get; set; }
        public int ModuleId { get; set; }
        public int? AddonId { get; set; }
    }
}

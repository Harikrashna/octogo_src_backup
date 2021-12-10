using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace CF.Octogo.Editions.Dto
{
    public class CreateEditionDto
    {
        [Required]
        public EditionCreateDto Edition { get; set; }

        [Required]
        public List<NameValueDto> FeatureValues { get; set; }
        public List<ModuleListDto> ModuleList { get; set;  }
        public List<PriceDiscount> priceDiscount { get; set; } = null;
        public int? DependantEditionID { get; set; }
        public int ProductId { get; set; }
        public int? ApproachId { get; set; }
        public bool isEdit { get; set; } = false;

    }
}
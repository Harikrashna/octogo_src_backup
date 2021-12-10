using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace CF.Octogo.Editions.Dto
{
    public class EditionCreateDto
    {
        public int? Id { get; set; }

        [Required]
        public string DisplayName { get; set; }   

        public decimal? DailyPrice { get; set; }

        public decimal? WeeklyPrice { get; set; }

        public decimal? MonthlyPrice { get; set; }

        public decimal? AnnualPrice { get; set; }

        public int? TrialDayCount { get; set; }

        public int? WaitingDayAfterExpire { get; set; }

        public int? ExpiringEditionId { get; set; }
    }
    public class EditionCreateDto_New
    {
        public int? Id { get; set; }

        [Required]
        public string DisplayName { get; set; }

        public int? TrialDayCount { get; set; }

        public int? WaitingDayAfterExpire { get; set; }

        public int? ExpiringEditionId { get; set; }
        public List<PriceDiscount> priceDiscount { get; set; } = null;
    }
    public class PriceDiscount
    {
        public int PricingTypeId { get; set; }
        public decimal Amount { get; set; }
        public decimal DiscountPercentage { get; set; }

    }
}
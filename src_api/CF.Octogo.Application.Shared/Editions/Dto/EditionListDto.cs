using Abp.Application.Services.Dto;
using CF.Octogo.Dto;

namespace CF.Octogo.Editions.Dto
{
    public class EditionListDto : EntityDto
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public decimal? DailyPrice { get; set; }

        public decimal? WeeklyPrice { get; set; }

        public decimal? MonthlyPrice { get; set; }

        public decimal? AnnualPrice { get; set; }

        public int? WaitingDayAfterExpire { get; set; }

        public int? TrialDayCount { get; set; }

        public string ExpiringEditionDisplayName { get; set; }
    }
    public class EditionListByProductDto : EntityDto
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

    }
    public class EditionListDtoNew : EntityDto
    {
        public string Name { get; set; }

        public string DisplayName { get; set; }

        public int? WaitingDayAfterExpire { get; set; }

        public int? TrialDayCount { get; set; }

        public string ExpiringEditionDisplayName { get; set; }
        public string ProductName { get; set; }
        public bool isFree { get; set; }
    }
    public class GetEditionInput : PagedAndSortedInputDto
    {
        public string Filter { get; set; }
    }
}
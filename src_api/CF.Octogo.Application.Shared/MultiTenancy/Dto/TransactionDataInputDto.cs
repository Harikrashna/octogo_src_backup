using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.MultiTenancy.Dto
{
    public class TransactionDataInputDto
    {
        public int ApproachId { get; set; }
        public List<AwbCountsDto> AWBData { get; set; }
    }
    public class AwbCountsDto
    {
        public int? CostId { get; set; }
        public int CountMin { get; set; }
        public int CountMax { get; set; }
        public decimal BillingRate { get; set; }
        public decimal Amount { get; set; }
    }
    public class TransactionChargesOutputDto
    {
        public int ApproachId { get; set; }
        public string AWBData { get; set; }
    }
}

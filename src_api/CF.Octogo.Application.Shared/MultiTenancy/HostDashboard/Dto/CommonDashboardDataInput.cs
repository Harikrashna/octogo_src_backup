using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.MultiTenancy.HostDashboard.Dto
{
   public  class CommonDashboardDataInput
    {
        public class TotalClientsDto
        {
            public string Name { get; set; }
            public List<TotalClientSeries> Series { get; set; }

        }
        public class TotalClientSeries
        {
            public string Name { get; set; }
            public double Value { get; set; }

        }
        public class TotalClientsRet
        {
            public string FilterName { get; set; }
            public string Data { get; set; }
        }

        public class TotalRevenueDto
        {
            public string Name { get; set; }
            public List<TotalRevenueSeries> Series { get; set; }

        }
        public class TotalRevenueSeries
        {
            public string Name { get; set; }
            public double Value { get; set; }

        }
        public class TotalRevenueRet
        {
            public string FilterName { get; set; }
            public string Data { get; set; }
        }

        public class PendingPaymentDto : DashboardInputBase
        {
            public string ClientName { get; set; }
            public int ClientId { get; set; }
            public string ProductName { get; set; }
            public decimal PendingPayment { get; set; }
            public int TotalCount { get; set; }
            public int PendingDays { get; set; }
        }

    }
}

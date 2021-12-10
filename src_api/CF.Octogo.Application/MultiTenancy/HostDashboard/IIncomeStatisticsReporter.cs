using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CF.Octogo.MultiTenancy.HostDashboard.Dto;

namespace CF.Octogo.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}
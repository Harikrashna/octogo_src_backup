using Abp.Dependency;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using CF.Octogo.Tenants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.HangfireJobs
{
    public class TenantChangesSyncWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private readonly ITenantDetailsAppService _tenantDetailsService;
        private const int CheckPeriodAsMilliseconds = 1 * 30 * 60 * 1000; // 30 mins
        public TenantChangesSyncWorker(AbpTimer timer, ITenantDetailsAppService tenantDetailsService) : base(timer)
        {
            Timer.Period = CheckPeriodAsMilliseconds;
            Timer.RunOnStart = true;
            _tenantDetailsService = tenantDetailsService;
        }
        protected override void DoWork()
        {
            _tenantDetailsService.CreateAdminUserOnTenantDB();
            _tenantDetailsService.CheckTeanantSetUpProcessAndSuccessMail();
            _tenantDetailsService.CheckTeanantSetUpProcessAndErrorMessage();
        }

    }
}

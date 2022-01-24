using Abp.Dependency;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.HangfireJobs
{
    public class TenantChangesSyncWorker : PeriodicBackgroundWorkerBase, ISingletonDependency
    {
        private const int CheckPeriodAsMilliseconds = 20000; //1 * 60 * 60 * 1000 * 24; //1 day
        public TenantChangesSyncWorker(AbpTimer timer) : base(timer)
        {
            Timer.Period = CheckPeriodAsMilliseconds;
            Timer.RunOnStart = true;
        }
        protected override void DoWork()
        {

        }

    }
}

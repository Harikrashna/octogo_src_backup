using Abp.AspNetCore.Mvc.Authorization;
using CF.Octogo.Authorization;
using CF.Octogo.Storage;
using Abp.BackgroundJobs;

namespace CF.Octogo.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}
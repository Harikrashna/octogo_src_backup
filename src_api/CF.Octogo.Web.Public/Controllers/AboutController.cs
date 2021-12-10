using Microsoft.AspNetCore.Mvc;
using CF.Octogo.Web.Controllers;

namespace CF.Octogo.Web.Public.Controllers
{
    public class AboutController : OctogoControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
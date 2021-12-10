using Microsoft.AspNetCore.Mvc;
using CF.Octogo.Web.Controllers;

namespace CF.Octogo.Web.Public.Controllers
{
    public class HomeController : OctogoControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
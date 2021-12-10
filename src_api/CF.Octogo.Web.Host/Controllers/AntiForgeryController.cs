using Microsoft.AspNetCore.Antiforgery;

namespace CF.Octogo.Web.Controllers
{
    public class AntiForgeryController : OctogoControllerBase
    {
        private readonly IAntiforgery _antiforgery;

        public AntiForgeryController(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }
    }
}

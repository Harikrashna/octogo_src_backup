using System.Threading.Tasks;
using CF.Octogo.Sessions.Dto;

namespace CF.Octogo.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}

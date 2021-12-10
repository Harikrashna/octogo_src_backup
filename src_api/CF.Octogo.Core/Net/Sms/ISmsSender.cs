using System.Threading.Tasks;

namespace CF.Octogo.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}
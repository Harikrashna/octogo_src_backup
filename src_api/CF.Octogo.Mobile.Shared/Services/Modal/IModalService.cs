using System.Threading.Tasks;
using CF.Octogo.Views;
using Xamarin.Forms;

namespace CF.Octogo.Services.Modal
{
    public interface IModalService
    {
        Task ShowModalAsync(Page page);

        Task ShowModalAsync<TView>(object navigationParameter) where TView : IXamarinView;

        Task<Page> CloseModalAsync();
    }
}

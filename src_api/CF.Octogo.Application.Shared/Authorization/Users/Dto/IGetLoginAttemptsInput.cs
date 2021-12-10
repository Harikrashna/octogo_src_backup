using Abp.Application.Services.Dto;

namespace CF.Octogo.Authorization.Users.Dto
{
    public interface IGetLoginAttemptsInput: ISortedResultRequest
    {
        string Filter { get; set; }
    }
}
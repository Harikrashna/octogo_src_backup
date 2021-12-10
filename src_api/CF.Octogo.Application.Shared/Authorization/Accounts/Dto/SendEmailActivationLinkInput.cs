using System.ComponentModel.DataAnnotations;

namespace CF.Octogo.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace CF.Octogo.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}

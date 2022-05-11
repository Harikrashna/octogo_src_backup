using Abp.Application.Services.Dto;

namespace CF.Octogo.Sessions.Dto
{
    public class UserLoginInfoDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public string ProfilePictureId { get; set; }
    }
    public class UserLoginInfoNewDto : EntityDto<long>
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string UserName { get; set; }

        public string EmailAddress { get; set; }

        public string ProfilePictureId { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public long? UserDetailId { get; set; } // Added by:Merajuddin
        public string UserTypeName { get; set; }// Added by:Merajuddin
        public int UserTypeId { get; set; }// Added by:Merajuddin
    }
}

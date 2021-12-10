using CF.Octogo.UserRegistration.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CF.Octogo.UserRegistration
{
    public interface IUserRegistrationAppService
    {
       Task CreateUserSignUp(UserSignUpInput input);
       Task<int> CreateDetailedUserRegistration(UserRegistrationInput input);
    }
}

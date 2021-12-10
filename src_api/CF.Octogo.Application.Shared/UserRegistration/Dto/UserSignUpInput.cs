using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.UserRegistration.Dto
{
    public class UserSignUpInput
    {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
            public string Password { get; set; }
            public int UserTypeId { get; set; }
    }
    public class UserRegistrationInput
    {
        public int UserTypeId { get; set; }
        public int UserId { get; set; }
        public string Company { get; set; }
        public int AirlineId { get; set; }
        public int DepartmentId { get; set; }
        public string Department { get; set; }
        public int DesignationId { get; set; }
        public string Designation { get; set; }
        public string Services { get; set; }
        public int City { get; set; }
        public int Country { get; set; }
        public string Contact { get; set; }
        public string RepresentingAirlines { get; set; }
        public string RepresentingCountries { get; set; }
        public int IndustryId { get; set; }
        public string Industry { get; set; }
        public int LoginUserId { get; set; }
        public string IsdCode { get; set; }
    }
    }

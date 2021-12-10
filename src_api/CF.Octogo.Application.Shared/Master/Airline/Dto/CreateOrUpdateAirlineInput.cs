﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Airline.Dto
{
    public class CreateOrUpdateAirlineInput
    {
        public Nullable<int> inAirlineID { get; set; }
        public string vcAirlineName { get; set; }
        public string vcDescription { get; set; }
    }
}
/*
	CREATED BY: Manav
	CREATED ON: 07/12/2021
	DESC
*/


CREATE PROCEDURE [dbo].[USP_CheckDuplicateAirline]
	@AirlineID int = null,
	@AirlineName varchar(50)= NULL
AS
	BEGIN
		SET NOCOUNT ON;

			BEGIN					
				SELECT AirlineName,Address
		  			FROM TblMst_Airline(NOLOCK)
		  			WHERE AirlineName=@AirlineName 
		  			AND IsActive=1 AND Sno!=@AirlineID
		  	END

	END





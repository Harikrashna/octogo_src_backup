/*
	CREATED BY: Manav
	CREATED ON: 07/12/2021
	DESC
*/


CREATE PROCEDURE [dbo].[USP_CheckDuplicateRecord]
	@AirlineID int = null,
	@AirlineName varchar(50)= NULL,
    @ServiceName VARCHAR(MAX) = NULL,
    @ServiceId int = null,
    @Description VARCHAR(250) = NULL
AS
	BEGIN
		SET NOCOUNT ON;
		IF(@AirlineName IS NOT NULL)
			BEGIN					
				SELECT AirlineName,Address
		  			FROM TblMst_Airline(NOLOCK)
		  			WHERE AirlineName=@AirlineName 
		  			AND IsActive=1 AND Sno!=@AirlineID
		  	END
		ELSE
			BEGIN
				SELECT vcServiceName,vcDescription
		  			FROM TblMst_Services(NOLOCK)
		  			WHERE vcServiceName = @ServiceName 
		  			AND btIsActive=1 AND inServiceID != @ServiceId
			END

	END






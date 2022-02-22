/*
*************************************************************************************
Procedure Name	:	USP_GetAirlineById 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Manav Tyagi
Created On		:   
Modified By (On):	
Description		:	
*************************************************************************************
*/


CREATE PROCEDURE [dbo].[USP_GetAirlineById]
	@AirlineId int
AS
BEGIN
	BEGIN TRY
		SELECT SNo,CarrierCode,	AirlineName,ICAOCode,CountryName,AirportCode,ContactPerson,
			MobileNo,PhoneNo,FaxNo,IsCheckModulus7,AWBDuplicacy,
			HandlingInformation,IsInterline,AirlineWebsite,IsCCAllowed,IsPartAllowed,
			IsActive,AirlineLogo,AwbLogo
			FROM TblMst_Airline(NOLOCK)
			WHERE SNo = @AirlineId AND IsActive = 1
	END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END









/*
*************************************************************************************
Procedure Name	:	USP_GetCountryId
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Vishal Dogra
Created On		:   29/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetCountryById]
@SNo INT
AS
	BEGIN
		BEGIN TRY
			SELECT 	SNo, CountryName, CountryCode, ISDCode, CurrencySNo, CurrencyCode,
					Continent, IATAAreaCode, Nationality
					FROM TblMst_Country(NOLOCK)
					WHERE SNo= @SNo AND IsActive = 1
	END TRY
 BEGIN CATCH
    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
  
END
/*
*************************************************************************************
Procedure Name	:	USP_CheckDuplicateCountry
Purpose		    :	For Country list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Vishal Dogra
Created On		:   29/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/

CREATE PROCEDURE [dbo].[USP_CheckDuplicateCountry]
	@CountryId INT = NULL,
	@CountryName VARCHAR(100),
	@CountryCode VARCHAR(50)
AS
BEGIN
	BEGIN TRY
	SET NOCOUNT ON;  

			SELECT  CountryName , CountryCode, ISDCode, CurrencyCode, Continent, IATAAreaCode, Nationality 
				FROM TblMst_Country(NOLOCK)
				WHERE CountryName = @CountryName OR CountryCode = @CountryCode 
					AND IsActive=1 
					AND SNo <> ISNULL(@CountryId,0) 
		END TRY
	BEGIN CATCH
	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END
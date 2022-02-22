/*
*************************************************************************************
Procedure Name  :   USP_CreateOrUpdateCountry
Purpose         :   For Create and update of country
Company         :   CargoFlash InfoTech. 
Scope           :    
Author          :   Vishal Dogra
Created On      :   28/12/2021
Modified By (On):   
Description     :   
*************************************************************************************

*/


CREATE PROCEDURE [dbo].[USP_CreateOrUpdateCountry] 
	@SNo INT = null,
	@CountryName VARCHAR(100),
	@CurrencySNo INT,
	@CountryCode VARCHAR(250),
	@ISDCode INT,
	@CurrencyCode VARCHAR(50),
	@Continent VARCHAR(50),
	@IATAAreaCode VARCHAR(50),
	@Nationality VARCHAR(50),
	@UserId BIGINT
AS

BEGIN
	BEGIN TRY
	BEGIN TRANSACTION
		IF(ISNULL(@SNo,0)=0)
		BEGIN
	      
		  INSERT INTO TblMst_Country
						(
						CountryName, CountryCode, ISDCode, CurrencySNo,	CurrencyCode, Continent, IATAAreaCode, Nationality,
						IsActive, CreatedOn, CreatedBy
						)
						VALUES
						(
						@CountryName, @CountryCode,	@ISDCode, @CurrencySNo,	@CurrencyCode, @Continent,
						@IATAAreaCode, @Nationality, 1, GETDATE(), @UserId
						)
				SELECT @SNo = SCOPE_IDENTITY();
	END
	ELSE
		BEGIN
				UPDATE TblMst_Country
				SET
				CountryName = @CountryName ,
				CountryCode = @CountryCode ,
				ISDCode = @ISDCode,
				CurrencySNo =@CurrencySNo,
				CurrencyCode = @CurrencyCode,
				Continent = @Continent,
				IATAAreaCode = @IATAAreaCode,
				Nationality = @Nationality,
				UpdatedOn=GETDATE(),
				UpdatedBy=@UserId
				WHERE SNo=@SNo
				AND IsActive = 1
			END

			SELECT @SNo [Id]
		COMMIT TRANSACTION
    END TRY
	BEGIN CATCH
	IF @@TRANCOUNT>0  
       ROLLBACK  
       DECLARE @ERRMSG NVARCHAR(4000) , @ERRSEVERITY INT  
       SELECT @ERRMSG = ERROR_MESSAGE() ,@ERRSEVERITY=ERROR_SEVERITY()  
  
       RAISERROR(@ERRMSG, @ERRSEVERITY , 1)  
    END CATCH  
END  
/*
*************************************************************************************
Procedure Name	:	USP_GetCountryList @MaxResultCount=100,@SkipCount=0
Purpose		    :	For Country list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Vishal Dogra
Created On		:   29/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
	
CREATE PROCEDURE [dbo].[USP_GetCountryList]  
(
	@MaxResultCount int,
	@SkipCount int,
	@Sorting varchar(50) =null,
	@filter varchar(50) =null
 )
AS    
    BEGIN 
		BEGIN TRY
		SET NOCOUNT ON;
		DECLARE @Sql VARCHAR(MAX)=''
			IF(ISNULL(@Sorting,'')='')
			BEGIN
				SET @Sorting = 'CountryName';
			END
			SET @Sql = @Sql + '
				SELECT SNo [SNo], CountryName [CountryName], CountryCode [CountryCode],  CurrencyCode [CurrencyCode], Continent [Continent]   
				 FROM TblMst_Country (NOLOCK) 
				 WHERE IsActive = 1 
				 AND (CountryName+''''+CountryCode like ''%'+ISNULL(@filter,'')+'%'') '
			SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
				SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			EXEC(@Sql)

			SELECT COUNT(SNo) [totalCount] 
				FROM TblMst_Country(NOLOCK)
				WHERE IsActive=1 
				AND CountryCode+''+ CountryName like '%'+ ISNULL(@filter,'')+'%'
		
  	END TRY
        BEGIN CATCH
	    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
  
    END


	 

	 
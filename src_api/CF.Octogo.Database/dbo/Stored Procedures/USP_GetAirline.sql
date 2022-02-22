/*
*************************************************************************************
Procedure Name	:	USP_GetAirline 10,0,null,'BAMBOO'
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Manav Tyagi
Created On		:   
Modified By (On):	
Description		:	
*************************************************************************************
*/

CREATE PROCEDURE [dbo].[USP_GetAirline]  
(
	@MaxResultCount INT,
 	@SkipCount INT,
 	@Sorting varchar(50) =NULL,
 	@filter varchar(50) =NULL
)
AS    
BEGIN 
	BEGIN TRY   
		DECLARE @Sql VARCHAR(MAX)=''
			IF(ISNULL(@Sorting,'')='')
				BEGIN
					SET @Sorting = 'AirlineName';
				END
			SET @Sql = @Sql + '
				SELECT Sno [AirlineId],CarrierCode,AirlineName [AirlineName],IsInterline,IsActive[Active]   
            	FROM TblMst_Airline (NOLOCK) 
            	WHERE IsActive = 1 
				AND AirlineName+''''+CarrierCode like ''%'+ISNULL(@filter,'')+'%'''
				SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
					SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
										FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			EXEC(@Sql)

			SELECT COUNT(SNo) [totalCount] 
				FROM TblMst_Airline(NOLOCK)
				WHERE IsActive=1 
	END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
        SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
        RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
  
END




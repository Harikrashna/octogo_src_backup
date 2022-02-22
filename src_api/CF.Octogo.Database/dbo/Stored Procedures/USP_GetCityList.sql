/*
*************************************************************************************
Procedure Name	:	USP_GetCityList @MaxResultCount=100,@SkipCount=0
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Deepak Mathpal
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetCityList]  
(
    @MaxResultCount int,
    @SkipCount int,
    @Sorting varchar(50) =null,
    @Filter varchar(50) =null
 )
AS    
    BEGIN   
        BEGIN TRY
            SET NOCOUNT ON; 
	        DECLARE @Sql VARCHAR(MAX)=''
		        IF(ISNULL(@Sorting,'')='')
		        BEGIN
		            SET @Sorting = 'CityName';
			    END
			    SET @Sql = @Sql + '
                SELECT SNo [SNo],CityCode [CityCode] ,CityName [CityName]  ,ZoneName [ZoneName] ,
                    StateName[StateName],CountryName[CountryName],PriorApproval,
					IsDayLightSaving,IsActive
                    FROM TblMst_City (NOLOCK) 
                    WHERE IsActive = 1 
                    AND (CityName+''''+ CountryName like ''%'+ISNULL(@Filter,'')+'%'') '
			    SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
				SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			    EXEC(@Sql)

			    SELECT COUNT(SNo) [totalCount] 
				    FROM TblMst_City(NOLOCK)
				    WHERE IsActive=1 
                    AND CityName+''+CountryName like '%'+ISNULL(@Filter,'')+'%'
		END TRY
        BEGIN CATCH
	    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
  
    END
	


	 

	 
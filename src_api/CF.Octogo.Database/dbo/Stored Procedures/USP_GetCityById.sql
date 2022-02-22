/*
*************************************************************************************
Procedure Name	:	
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Deepak Mathpal
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE procedure [dbo].[USP_GetCityById]
@SNo int
AS 
    BEGIN
        BEGIN TRY
            SELECT SNo, CityCode , CityName,ZoneSNo,ZoneName,StateSNo,
                StateName,CountrySNo,CountryCode,CountryName,TimeZoneSNo,
                IataArea as IataAreaCode,ShcSNo,DgClassSNo,PriorApproval,IsActive,IsDayLightSaving 
                FROM TblMst_City 
                WHERE SNo = @SNo AND IsActive = 1
	END TRY
    BEGIN CATCH
    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
  
End



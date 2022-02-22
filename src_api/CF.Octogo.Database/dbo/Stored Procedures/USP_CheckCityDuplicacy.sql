/*
*************************************************************************************
Procedure Name	:	
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Deepak
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_CheckCityDuplicacy]  
(  
	@SNo int = null, 
    @CityName varchar(100),  
    @CityCode varchar(100)
)     
AS  
BEGIN  
    BEGIN TRY
        SELECT SNo, CityName, CityCode 
            FROM TblMst_City (NOLOCK) 
            WHERE (CityName=@CityName OR CityCode=@CityCode)
            AND SNo <> ISNULL(@SNo,0)
    END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH

END
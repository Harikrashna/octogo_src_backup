/*
*************************************************************************************
Procedure Name	:	USP_GetMastersDataForEdition  
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   2 Nov 2021
Modified By (On):	
Description		:	
*************************************************************************************
*/

CREATE PROCEDURE [USP_GETMASTERSDATAFOREDITION]
AS
    BEGIN
        BEGIN TRY
            SELECT inApproachID [Id], vcApproachName [ApproachName] 
                FROM TblMst_PricingApproach (NOLOCK)
                WHERE btIsActive = 1

            SELECT inProductId [Id], vcProductName [ProductName] 
                FROM TblMst_Product (NOLOCK)
                WHERE btIsActive = 1
        END TRY
        BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	        SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	        RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH   
    END
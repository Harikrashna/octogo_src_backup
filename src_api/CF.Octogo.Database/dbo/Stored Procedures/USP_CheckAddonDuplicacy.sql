/*
*************************************************************************************
Procedure Name	:	USP_CheckAddonDuplicacy @EditionId=77, @AddonName='CRA Addon',@AddonId=0,@IsFree=0,@SelectedPageSno='1,4,9,14,16'
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Hari Krashna
Created On		:   14 Jan 2022
Modified By (On):	
Description		:	
USP_CheckAddonDuplicacy @EditionId=77, @AddonName='CRA Addon1',@AddonId=0,@IsFree=1,@SelectedPageSno='1,4,9,14,16'
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_CheckAddonDuplicacy]  
(  
	@EditionId INT, 
    @AddonName VARCHAR(100),  
    @AddonId INT = NULL,
    @IsFree BIT = 1,
    @SelectedPageSno VARCHAR(MAX) = NULL
)     
AS  
BEGIN  
    BEGIN TRY
        ;WITH CTE AS
        (
            SELECT DISTINCT AD.inAddonId, AD.vcAddOnName, STRING_AGG(inModuleId,',')  WITHIN GROUP (ORDER BY inModuleId) PageModuleSno,
                CASE WHEN APP.inAddonId IS NULL THEN CAST(1 AS BIT) 
                        ELSE CAST(0 AS BIT) END AS IsFree
                FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping module(NOLOCK)
                INNER JOIN TblTrn_Addon AD(NOLOCK)
                    ON AD.inAddOnID = module.inAddonId
                    AND module.btIsActive = 1 AND AD.btIsActive = 1
                LEFT JOIN TblTrn_AddOnPricing_Prepaid APP(NOLOCK)
                    ON APP.inAddOnID = module.inAddonId
                    AND APP.btIsActive = 1
                WHERE AD.inEditionID = @EditionId
                AND AD.inAddonId <> ISNULL(@AddonId,0)
                GROUP BY AD.inAddonId, AD.vcAddOnName, APP.inAddonId
        )
        SELECT CTE.inAddonId, vcAddOnName
            FROM CTE
            WHERE vcAddOnName = @AddonName
            OR (CTE.PageModuleSno = @SelectedPageSno AND CTE.IsFree = @IsFree) 
            
    END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH

END
/*
*************************************************************************************
Procedure Name	:	USP_GetAddonModuleAndPricing 26
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	
Author			:	Hari Krashna
Created On		:   13 Jan 2022
Modified By (On):	
Description		:	
EXEC USP_GetAddonModuleAndPricing 1
*************************************************************************************
*/

CREATE PROCEDURE USP_GetAddonModuleAndPricing
(
    @AddonId INT
)
AS
    BEGIN
        BEGIN TRY
            SELECT 
                (
                    SELECT DISTINCT module.inModuleId [PageId], module.vcModuleName [ModuleName],
                        (
                            SELECT inModuleId [PageId], vcModuleName [SubModuleName],
                                    (
                                        SELECT inModuleId [PageId], vcModuleName [SubModuleName]
                                            FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping (NOLOCK)
                                            WHERE btIsActive = 1
                                            AND inParentModuleId = subModule.inModulemappingId
                                             FOR JSON AUTO
                                    ) AS SubSubModuleList
                                FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping subModule (NOLOCK)
                                WHERE btIsActive = 1
                                AND inParentModuleId = module.inModulemappingId
                                 FOR JSON AUTO
                        ) AS SubModuleList
                        FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping module(NOLOCK)
                        WHERE module.inAddOnID = @AddonId AND module.btIsActive = 1
                        AND module.inParentModuleId IS NULL
                        FOR JSON PATH
                ) AS ModuleList,
                (
                    SELECT inAddonPricingID [AddonPricingID],inPricingTypeID [PricingTypeID],
                        dcAmount [Amount], dcDiscountPercentage [DiscountPercentage]
                        FROM TblTrn_AddonPricing_Prepaid APP (NOLOCK)
                        WHERE APP.inAddonId = @AddonId  AND btIsActive = 1
                        FOR JSON PATH
                ) AS PricingData
                FROM TblTrn_Addon AD (NOLOCK)
                WHERE inAddOnID = @AddonId AND btIsActive = 1
        END TRY
        BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	        SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	        RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END

 


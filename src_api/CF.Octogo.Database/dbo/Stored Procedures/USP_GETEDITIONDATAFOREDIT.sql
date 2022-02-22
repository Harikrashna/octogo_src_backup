/*
*************************************************************************************
Procedure Name	:	USP_GetEditionDataForEdit 46  
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   2 Nov 2021
Modified By (On):	
Description		:	
*************************************************************************************
*/

CREATE PROCEDURE [USP_GETEDITIONDATAFOREDIT]
(
    @EditionId INT
)
AS
BEGIN
    BEGIN TRY
        SELECT Id, DisplayName, ExpiringEditionId, AEM.inApproachID [ApproachId], PEM.inProductID [ProductId],
           TrialDayCount, CASE WHEN TrialDayCount > 0 THEN  CAST(1 AS BIT) ELSE  CAST(0 AS BIT) END [IsTrialActive],
            WaitingDayAfterExpire, CASE WHEN WaitingDayAfterExpire > 0 THEN CAST(1 AS BIT) ELSE  CAST(0 AS BIT) END [WaitAfterExpiry],
            inDependantEditionID [DependantEditionID],
            CASE WHEN ED.inDependancyID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END [DependantEdition],
           (
                SELECT inModuleID [ModuleId], vcModuleName [ModuleName],
                    (SELECT inSubModuleID [SubModuleId], vcSubModuleName [SubModuleName] 
                        FROM TblTrn_SubModules SM (NOLOCK)
                        WHERE SM.inModuleId = EM.inModuleId AND btIsActive = 1
                        FOR JSON PATH
                    ) AS SubModules
                FROM TblTrn_EditionModules EM (NOLOCK)
                WHERE inEditionID = @EditionId AND btIsActive = 1
                FOR JSON PATH
            ) AS ModuleData,
            (
                SELECT EPP.inEditionPricingID [EditionPricingID],EPP.inPricingTypeID [PricingTypeID],
                    EPP.dcAmount [Amount], EPP.dcDiscountPercentage [DiscountPercentage],
                    PT.vcTypeName [PricingTypeName], PT.inNoOfDays [NoOfDays]
                    FROM TblTrn_EditionPricing_Prepaid EPP(NOLOCK)
                    INNER JOIN TblMst_PricingType PT(NOLOCK)
                        ON PT.inPricingTypeID = EPP.inPricingTypeID 
                        AND PT.btIsActive = 1 
                    WHERE EPP.inEditionID =  @EditionId AND EPP.btIsActive = 1
                    FOR JSON PATH
            ) AS PricingData            
            FROM AbpEditions E (NOLOCK)
            INNER JOIN TblTrn_ApproachEditionMapping AEM (NOLOCK)
                ON E.Id = AEM.inEditionID AND AEM.btIsActive = 1
            INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)
                ON PEM.inEditionID = E.Id AND PEM.btIsActive = 1
            LEFT JOIN TblTrn_EditionDependancy ED(NOLOCK)
                ON E.Id = ED.inEditionID AND ED.btIsActive = 1
        WHERE E.Id = @EditionId AND IsDeleted = 0
    END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH   
END
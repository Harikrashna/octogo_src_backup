/*
    CREATED ON : 02 Nov 2021
    DESC : 
    DRY RUN : 
                GETEDITIONDATAFOREDIT 46
*/

CREATE PROCEDURE GETEDITIONDATAFOREDIT
(
    @EditionId INT
)
AS
    BEGIN
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
                SELECT inEditionPricingID [EditionPricingID],inPricingTypeID [PricingTypeID],
                    dcAmount [Amount], dcDiscountPercentage [DiscountPercentage]
                    FROM TblTrn_EditionPricing_Prepaid (NOLOCK)
                    WHERE inEditionID =  @EditionId AND btIsActive = 1
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
    END
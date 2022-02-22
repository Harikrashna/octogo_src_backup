/*
*************************************************************************************
Procedure Name	:	USP_GetEditonDetailToCompare @EditionIds = '142,77,124'
Purpose		    :	For Edition compare
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Hari Krashna
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/

CREATE PROCEDURE USP_GetEditonDetailToCompare
(
    @EditionIds VARCHAR(MAX)
)
AS
    BEGIN
        BEGIN TRY
            SET NOCOUNT ON;    
            
            DECLARE @SelectedEditionIds Table(SequenceNo INT, EditionId INT);

            INSERT INTO @SelectedEditionIds(SequenceNo, EditionId)
                SELECT ROW_NUMBER() OVER(ORDER BY [value]) [row_no] , [value] FROM String_Split(@EditionIds, ',')
            ; WITH Dependency_CTE1 
            AS
            (
               SELECT inDependantEditionID, inEditionID , inEditionID ParentId
                  FROM TblTrn_EditionDependancy (NOLOCK)
                  WHERE btIsActive = 1 
               UNION ALL
               SELECT ED.inDependantEditionID, ED.inEditionID , CTE.ParentId ParentId
                  FROM TblTrn_EditionDependancy ED (NOLOCK)
                  INNER JOIN Dependency_CTE1 CTE
                     ON CTE.inDependantEditionID = ED.inEditionID
                  WHERE ED.btIsActive = 1
            ),
            Dependency_CTE2 
            AS
            (
               SELECT ParentId,inDependantEditionID 
                  FROM Dependency_CTE1
               UNION ALL
               SELECT DISTINCT inDependantEditionID [ParentId], inDependantEditionID 
                  FROM Dependency_CTE1
               UNION ALL
               SELECT DISTINCT ParentId, ParentId [inDependantEditionID] 
                  FROM Dependency_CTE1
               UNION ALL
               SELECT DISTINCT  E.Id, E.Id [inDependantEditionID] 
                  FROM AbpEditions E(NOLOCK)
                  LEFT JOIN Dependency_CTE1 CT
                     ON E.Id = CT.ParentId
                  WHERE CT.ParentId IS NULL AND E.IsDeleted = 0
            )
            SELECT DISTINCT ParentId [EditionId],ModuleId, ModuleName
            INTO #EditionModulesData
               FROM (
                     SELECT ParentId,inModuleID [ModuleId], vcModuleName [ModuleName]
                        FROM Dependency_CTE2 cte
                        INNER JOIN TblTrn_EditionModules EM (NOLOCK)
                           ON EM.inEditionID = cte.inDependantEditionID
                           WHERE EM.btIsActive = 1
               ) AS EditionData
               ORDER BY ParentId


            SELECT DISTINCT Ids.SequenceNo,Ed.inEditionID AS [EditionID],  Abe.DisplayName AS [EditionName] ,
                P.inProductID [ProductId], P.vcProductName [ProductName], 
                ISNULL(Abe.TrialDayCount,0) TrialDayCount,
                CASE WHEN ISNULL(Abe.TrialDayCount,0) =  0 THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END IsTrailActive,   
                    (SELECT Em.ModuleID [ModuleId], Em.ModuleName [ModuleName] ,    
                            (SELECT Sbm.inSubModuleID [SubModuleID], Sbm.vcSubModuleName [SubModuleName],
                                        (SELECT inSubModuleID [SubModuleID], vcSubModuleName [SubModuleName]    
                                            FROM TblTrn_SubModules(NOLOCK)
                                            WHERE inParantId = Sbm.inSubModuleId AND btIsActive=1 
                                            FOR JSON PATH
                                        ) AS SubSubModule    
                                    FROM TblTrn_SubModules Sbm(NOLOCK)    
                                    INNER JOIN TblTrn_EditionModules Edm(NOLOCK)  
                                    ON Edm.inModuleID=Sbm.inModuleID    
                                    WHERE Edm.inModuleID= Em.ModuleID AND Sbm.inParantId IS NULL
                                    AND Sbm.btIsActive=1 AND Edm.btIsActive=1 
                                    FOR JSON PATH
                            ) AS SubModule    
                        FROM TblTrn_ProductEditionMapping Pem(NOLOCK)    
                        INNER JOIN #EditionModulesData Em(NOLOCK)  
                            ON Em.EditionID=Pem.inEditionID    
                        WHERE Pem.btIsActive=1  
                        AND Em.EditionID=Ed.inEditionID    
                        FOR JSON PATH
                    ) AS Modules,    
               (SELECT Epp.inPricingTypeID [PricingTypeId], Epp.dcDiscountPercentage [Discount], 
                        Pt.vcTypeName [TypeName] , Pt.inNoOfDays [Days], Epp.dcAmount [Price]    
                        FROM TblTrn_EditionPricing_Prepaid Epp(NOLOCK)     
                        INNER JOIN TblMst_PricingType Pt(NOLOCK)  
                            ON Epp.inPricingTypeID=Pt.inPricingTypeID     
                         WHERE Epp.btIsActive=1 AND Pt.btIsActive=1     
                            AND Epp.inEditionID=Ed.inEditionID 
                        FOR JSON PATH
                    ) AS PricingData,    

                    (SELECT Ado.inAddOnID [AddOnId], Ado.vcAddonName [AddOnName],    
                            (SELECT Aopp.inPricingTypeID [PricingTypeId], Aopp.dcDiscountPercentage [Discount], 
                                    Aopp.dcAmount [Price], pt.vcTypeName [TypeName], pt.inNoOfDays [Days]    
                                    FROM TblTrn_AddOnPricing_Prepaid Aopp(NOLOCK)     
                                    INNER JOIN TblMst_PricingType pt(NOLOCK) 
                                        ON Aopp.inPricingTypeID=pt.inPricingTypeID     
                                    WHERE Aopp.btIsActive=1 AND pt.btIsActive=1 
                                        AND Aopp.inAddOnID=Ado.inAddOnID 
                                    FOR JSON PATH
                            ) AS AddonPrice,    
                            (
                                SELECT DISTINCT inModuleId [PageId], vcModuleName [ModuleName],
                                    (
                                        SELECT inModuleId [PageId], vcModuleName [SubModuleName],
                                                (
                                                    SELECT inModuleId [PageId], vcModuleName [SubModuleName]
                                                        FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping (NOLOCK)
                                                        WHERE btIsActive = 1
                                                        AND inParentModuleId = subModule.inModuleMappingID
                                                         FOR JSON AUTO
                                                ) AS SubSubModuleList
                                            FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping subModule (NOLOCK)
                                            WHERE btIsActive = 1
                                            AND inParentModuleId = module.inModuleMappingID
                                             FOR JSON AUTO
                                    ) AS SubModuleList
                                    FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping module(NOLOCK)
                                    WHERE inAddOnID = Ado.inAddonId AND btIsActive = 1
                                    AND inParentModuleId IS NULL
                                    FOR JSON AUTO
                            ) AS ModuleList   
                        FROM TblTrn_AddOn Ado(NOLOCK)      
                        WHERE Ado.btIsActive=1 
                            AND Ado.inEditionID=Ed.inEditionID 
                        FOR JSON PATH
                    ) AS AddonList    
                FROM TblMst_Product P(NOLOCK)     
                INNER JOIN TblTrn_ProductEditionMapping Ed(NOLOCK) 
                    ON Ed.inProductID=P.inProductID     
                INNER JOIN  AbpEditions Abe 
                    ON Ed.inEditionID=Abe.Id    
                INNER JOIN TblTrn_EditionModules EM(NOLOCK)  
                    ON EM.InEditionId = Abe.Id AND EM.btIsActive = 1
                INNER JOIN @SelectedEditionIds Ids
                 ON Abe.Id = Ids.EditionId
                WHERE P.btIsActive=1 AND Ed.btIsActive=1     
                    -- AND Ed.inProductID = @ProductId 
                    AND Abe.IsDeleted = 0
                ORDER BY Ids.SequenceNo
        END TRY
        BEGIN CATCH
	    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END
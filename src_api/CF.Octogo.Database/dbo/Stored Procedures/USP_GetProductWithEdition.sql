/*
*************************************************************************************
Procedure Name	:	USP_GetProductWithEdition 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   
Modified By (On):	
Description		:  
*************************************************************************************
*/

CREATE PROCEDURE [dbo].[USP_GetProductWithEdition]
(
    @EditionId INT = NULL
)    
AS    
BEGIN 
    BEGIN TRY    
        SET NOCOUNT ON;    
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


       SELECT product.inProductID [ProductID] , product.vcProductName [ProductName], product.vcDescription [Description],   
        (SELECT DISTINCT Ed.inEditionID AS [EditionID],  Abe.DisplayName AS [EditionName] , ISNULL(Abe.TrialDayCount,0) TrialDayCount,    
         (SELECT Em.ModuleID [ModuleId], Em.ModuleName [ModuleName] , Em.EditionID [EditionID] ,    
          (SELECT Sbm.inSubModuleID [SubModuleID], Sbm.vcSubModuleName [SubModuleName] , Sbm.inModuleID [ModuleID]      
           FROM TblTrn_SubModules Sbm(NOLOCK)    
            INNER JOIN TblTrn_EditionModules Edm(NOLOCK)  ON Edm.inModuleID=Sbm.inModuleID    
            WHERE Edm.inModuleID= Em.ModuleID AND Sbm.btIsActive=1 AND Edm.btIsActive=1 FOR JSON PATH)     
           AS SUBMODULE    
          FROM TblTrn_ProductEditionMapping Pem(NOLOCK)    
          -- INNER JOIN TblTrn_EditionModules Em(NOLOCK)  ON Em.inEditionID=Pem.inEditionID    
          -- WHERE Em.inEditionID=Ed.inEditionID AND Em.btIsActive=1 AND Pem.btIsActive=1 
          INNER JOIN #EditionModulesData Em(NOLOCK)  ON Em.EditionID=Pem.inEditionID    
             WHERE Pem.btIsActive=1  AND Em.EditionID=Ed.inEditionID    
          FOR JSON PATH)    
          AS MODULE,    
         (SELECT Epp.inPricingTypeID [PricingTypeId], Epp.dcDiscountPercentage [Discount], Pt.vcTypeName [Name] , Pt.inNoOfDays [Days], Epp.dcAmount [Price]    
          FROM TblTrn_EditionPricing_Prepaid(NOLOCK) Epp     
          INNER JOIN TblMst_PricingType Pt(NOLOCK)  ON Epp.inPricingTypeID=Pt.inPricingTypeID     
          WHERE Epp.btIsActive=1 AND Pt.btIsActive=1     
          AND Epp.inEditionID=Ed.inEditionID FOR JSON PATH)    
         AS PRICINGTYPE,    

                   (SELECT Ado.inAddOnID [AddOnId], Ado.vcAddonName [AddOnName],    
                            (SELECT Aopp.inAddOnID [AddOnId], Aopp.dcAmount [Price], pt.vcTypeName [Name], pt.inNoOfDays [Days]
                                    , Aopp.dcDiscountPercentage [Discount]    
                                    FROM TblTrn_AddOnPricing_Prepaid Aopp(NOLOCK)     
                                    INNER JOIN TblMst_PricingType pt(NOLOCK) 
                                        ON Aopp.inPricingTypeID=pt.inPricingTypeID     
                                    WHERE Aopp.btIsActive=1 AND pt.btIsActive=1 
                                        AND Aopp.inAddOnID=Ado.inAddOnID 
                                    FOR JSON PATH
                            ) AS ADDONPrice,    
                            (
                                SELECT DISTINCT inModuleId [PageId], vcModuleName [ModuleName],
                                    (
                                        SELECT inModuleId [PageId], vcModuleName [SubModuleName],
                                                (
                                                    SELECT inModuleId [PageId], vcModuleName [SubModuleName]
                                                        FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping (NOLOCK)
                                                        WHERE btIsActive = 1
                                                        AND inParentModuleId = subModule.inModuleId
                                                         FOR JSON AUTO
                                                ) AS SubSubModuleList
                                            FROM TblTrn_AddonModule_SubModule_SubSubModuleMapping subModule (NOLOCK)
                                            WHERE btIsActive = 1
                                            AND inParentModuleId = module.inModuleId
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
                    ) AS ADDONS     


        FROM TblMst_Product P(NOLOCK)     
         INNER JOIN TblTrn_ProductEditionMapping Ed(NOLOCK) ON Ed.inProductID=P.inProductID     
         INNER join  AbpEditions Abe ON Ed.inEditionID=Abe.Id    
         Inner Join TblTrn_EditionModules EM(NOLOCK)  
            ON EM.InEditionId = Abe.Id AND EM.btIsActive = 1  
         WHERE P.btIsActive=1 AND Ed.btIsActive=1     
                AND product.inProductID = Ed.inProductID 
                AND Abe.IsDeleted = 0
                AND Abe.Id <> ISNULL(@EditionId,0)   
                        FOR JSON PATH    
        ) AS [Edition]    
         FROM Tblmst_Product product(NOLOCK) WHERE product.btIsActive=1 --FOR JSON PATH  
    END TRY
    BEGIN CATCH
    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END 
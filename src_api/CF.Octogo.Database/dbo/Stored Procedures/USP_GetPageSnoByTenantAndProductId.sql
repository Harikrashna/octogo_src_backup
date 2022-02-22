/*
*************************************************************************************
Procedure Name	:	USP_GetPageSnoByTenantAndProductId 167,1 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   03/02/2022
Modified By (On):	
Description		:	
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetPageSnoByTenantAndProductId]
(
    @TenantId INT,
    @ProductId INT
)
AS
    BEGIN
        BEGIN TRY    
            SET NOCOUNT ON; 
            DECLARE @EditionId INT;
            DECLARE @EditionAndAddon Table(EditionId INT, AddonId INT NULL); 

            -- Get Edition and Addon
            INSERT INTO @EditionAndAddon(EditionId, AddonId)
            SELECT TNT.inEditionID, TNT.inAddOnID
                FROM TblTrn_TenantEditionAddOnMapping TNT(NOLOCK)
                INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK) 
                    ON TNT.inEditionID = PEM.inEditionID 
                    AND PEM.btIsActive = 1 AND TNT.btIsActive = 1	
                    WHERE TNT.inTenantID = @TenantId
                    AND PEM.inProductID = @ProductId
                    AND TNT.inAddOnID IS NULL
            
            SELECT @EditionId = EditionId FROM @EditionAndAddon WHERE AddonId IS NULL

            -- Get Dependent heirarchy of edition
            ; WITH Edition_CTE AS
            (
                SELECT EditionId [inDependantEditionID], EditionId [inEditionID] 
                    FROM @EditionAndAddon WHERE AddonId IS NULL
                -- SELECT inDependantEditionID, inEditionID 
                --     FROM TblTrn_EditionDependancy (NOLOCK) 
                --     WHERE btIsActive = 1 
                --     AND inEditionID = (SELECT EditionId FROM @EditionAndAddon WHERE AddonId IS NULL)
                UNION ALL
                SELECT  ED.inDependantEditionID, ED.inEditionID 
                    FROM TblTrn_EditionDependancy ED (NOLOCK)
                    INNER JOIN Edition_CTE CTE 
                        ON CTE.inDependantEditionID = ED.inEditionID
                    WHERE ED.btIsActive = 1
            )    
            , CTEEditionPages AS
            (
                -- Modules
                SELECT EM.inModuleID [ModuleId], InPageModuleId
                    FROM TblTrn_EditionModules EM(NOLOCK)
                    INNER JOIN Edition_CTE E 
                        ON E.inDependantEditionID = EM.inEditionID 
                UNION ALL
                
                -- Sub modules and Sub-Sub modules
                SELECT SM.inSubModuleId  [ModuleId] , SM.InPageModuleId
                    FROM TblTrn_SubModules SM(NOLOCK)
                    INNER JOIN TblTrn_EditionModules EM	
                        ON EM.inModuleID = SM.inModuleID
                        AND SM.btIsActive = 1 
                    INNER JOIN Edition_CTE E 
                        ON E.inDependantEditionID = EM.inEditionID 
            )

            SELECT @EditionId [EditionId],
                    (SELECT PageSno FROM
                        (
                            -- Edition PageSno
                            SELECT DISTINCT PG.SNo [PageSno]
                                FROM CTEEditionPages CTE
                                INNER JOIN TblMst_Page PG(NOLOCK)
                                    ON CTE.InPageModuleId = PG.SNo 
                                    AND PG.IsActive = 1
                            UNION ALL
                             -- Addon PageSno
                            SELECT DISTINCT AMSM.inModuleID [PageSno]
                                FROM @EditionAndAddon addon
                                INNER JOIN TblTrn_AddonModule_SubModule_SubSubModuleMapping AMSM(NOLOCK)
                                    ON addon.AddonId = AMSM.inAddonId AND AMSM.btIsActive = 1
                                INNER JOIN TblMst_Page PG(NOLOCK)
                                    ON AMSM.inModuleID = PG.SNo 
                                    AND PG.IsActive = 1
                                INNER JOIN Edition_CTE E 
                                    ON E.inEditionID = addon.EditionId 
                        ) AS T 
                        FOR JSON PATH
                    ) [Pages]
            
        END TRY
        BEGIN CATCH
        	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
        	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
        	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END
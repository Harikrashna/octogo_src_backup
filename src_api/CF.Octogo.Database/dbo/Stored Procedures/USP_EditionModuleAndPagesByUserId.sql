/*
*************************************************************************************
Procedure Name	:	USP_EditionModuleAndPagesByUserId
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   20 Jan 2022
Modified By (On):	
Description		:  
USP_EditionModuleAndPagesByUserId @ProductId=1, @UserId = 292
*************************************************************************************
*/
CREATE PROCEDURE USP_EditionModuleAndPagesByUserId
(
    @UserId INT,
    @ProductId INT
)
AS
    BEGIN
        BEGIN TRY    
            SET NOCOUNT ON;  

            ;WITH CTEPages AS
            (
                SELECT EM.inModuleID [ModuleId], inPageModuleId 
                    FROM TblTrn_EditionModules EM(NOLOCK)
                    INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK)
                        ON PEM.inEditionID = EM.inEditionID 
                        AND PEM.btIsActive = 1 
                        AND PEM.inProductID = @ProductId 
                    -- INNER JOIN AbpTenants TNT(NOLOCK)    
                    INNER JOIN TblTrn_TenantEditionAddOnMapping TNT	
                        ON TNT.inEditionID = EM.inEditionID 
                        AND EM.btIsActive = 1 AND TNT.btIsActive = 1	
                    INNER JOIN AbpUsers usr(NOLOCK)
                        ON usr.TenantId = TNT.inTenantID AND usr.IsDeleted = 0
                        WHERE usr.Id = @UserId
                UNION ALL
                SELECT SM.inSubModuleId  [ModuleId] , SM.InPageModuleId
                    FROM TblTrn_SubModules SM(NOLOCK)
                    INNER JOIN CTEPages CTE	
                        ON CTE.ModuleID = SM.inModuleID
                        AND SM.btIsActive = 1 

            )
            SELECT PG.SNo [PageSno], PG.PageName, PG.MenuSNo [ParentSno] FROM CTEPages CTE
                INNER JOIN TblMst_Page PG(NOLOCK)
                    ON CTE.InPageModuleId = PG.SNo 
                    AND PG.IsActive = 1
            
        END TRY
        BEGIN CATCH
        	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
        	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
        	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END


/*
*************************************************************************************
Procedure Name	:	USP_CheckEditionDuplicacy
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Hari Krashna
Created On		:   26 Jan 2022
Modified By (On):	
Description		:	
USP_CheckEditionDuplicacy @ProductId=1, @EditionName='dfgd',@EditionId=219,@IsFree=1,@SelectedPageSno='63,159,161',@DependentEditionId=214
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_CheckEditionDuplicacy]  
(  
	@ProductId INT, 
    @EditionName VARCHAR(100),  
    @EditionId INT = NULL,
    @IsFree BIT = NULL,
    @SelectedPageSno VARCHAR(MAX) = NULL,
    @DependentEditionId INT = NULL 
)     
AS  
BEGIN  
    BEGIN TRY
        ;WITH CTE_EditionModule AS
        (
            SELECT DISTINCT E.Id [Id], E.DisplayName [EditionName], EM.InPageModuleId, EM.inModuleId, ED.inDependantEditionID [DependentEditionId],
                CASE WHEN EPP.inEditionID IS NULL THEN CAST(1 AS BIT) 
                        ELSE CAST(0 AS BIT) END AS IsFree
                FROM AbpEditions E (NOLOCK)
                INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)
                    ON E.Id = PEM.inEditionId
                    AND E.IsDeleted = 0 AND PEM.btIsActive = 1
                INNER JOIN TblTrn_EditionModules EM(NOLOCK)
                    ON EM.inEditionID = E.Id AND EM.btIsActive = 1
                LEFT JOIN TblTrn_EditionPricing_Prepaid EPP (NOLOCk)
                    ON EPP.inEditionID = E.Id AND EPP.btIsActive = 1
                LEFT JOIN TblTrn_EditionDependancy ED(NOLOCK)
                    ON ED.inEditionID = E.Id  AND ED.btIsActive = 1
                WHERE PEM.inProductId = @ProductId 
        )
        , CTE_SubModules AS
        (
            SELECT EM.Id, SM.inSubModuleId, EM.EditionName, SM.InPageModuleId, EM.IsFree, DependentEditionId
                FROM CTE_EditionModule EM
                INNER JOIN TblTrn_SubModules SM(NOLOCK)
                    ON SM.inModuleId = EM.inModuleId AND SM.btIsActive = 1
            UNION ALL
            SELECT CTE.Id, SM.inSubModuleId, CTE.EditionName, SM.InPageModuleId, CTE.IsFree, DependentEditionId
                FROM TblTrn_SubModules SM
                INNER JOIN CTE_SubModules CTE
                    ON SM.InParantID = CTE.inSubModuleId 
                    AND SM.btIsActive = 1
        )
        , CTE_All AS
        (
            SELECT Id, EditionName, STRING_AGG(InPageModuleId,',')  WITHIN GROUP (ORDER BY InPageModuleId) PageModuleSno, IsFree, DependentEditionId
                FROM
                (
                    SELECT DISTINCT Id, EditionName, InPageModuleId, IsFree, DependentEditionId
                        FROM 
                        (
                            SELECT Id, EditionName, InPageModuleId, IsFree, DependentEditionId
                                FROM CTE_SubModules
                            UNION ALL
                            SELECT Id, EditionName, InPageModuleId, IsFree, DependentEditionId
                                FROM CTE_EditionModule
                        ) AS T
                        WHERE Id <> ISNULL(@EditionId,0)
                        
                ) AS T
                GROUP BY Id, EditionName, IsFree, DependentEditionId
        )
        SELECT Id, EditionName,PageModuleSno,DependentEditionId
            FROM CTE_All
            WHERE EditionName = @EditionName
            OR (CTE_All.PageModuleSno = @SelectedPageSno 
                AND CTE_All.IsFree = @IsFree 
                AND ISNULL(@DependentEditionId,0) =  ISNULL(DependentEditionId,0)
               ) 


    END TRY
    BEGIN CATCH
	    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH

END
/*
*************************************************************************************
Procedure Name	:	USP_GetModuleListByEditionForAddon 127
Purpose		    :	Get Edition list for create addons
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   10/01/2022
Modified By (On):	
Description		:	

*************************************************************************************
*/

CREATE PROCEDURE USP_GetModuleListByEditionForAddon
(
    @EditionId INT
)
AS
    BEGIN
        BEGIN TRY
            SELECT EM.[inModuleID] [ModuleId], EM.InPageModuleId PageId, EM.vcModuleName [ModuleName],
                -- FromE.Id [FromEditionId], FromE.DisplayName [FromEditionName],
                (
                    SELECT SM.inSubModuleID [SubModuleId], SM.InPageModuleId [PageId],
                            SM.vcSubModuleName [SubModuleName],
                            (
                                SELECT SSM.inSubModuleID [SubModuleId], SSM.InPageModuleId [PageId],
                                    SSM.vcSubModuleName [SubModuleName] 
                                    FROM TblTrn_SubModules SSM(NOLOCK)
                                    INNER JOIN TblMst_Page P(NOLOCK)
                                        ON P.SNo = SSM.InPageModuleId AND P.IsActive= 1
                                    WHERE SSM.InParantID = SM.inSubModuleId
                                    AND EM.btIsActive = 1 AND SSM.btIsActive = 1
                                    FOR JSON PATH
                            )  AS SubSubModuleList 
                        FROM TblTrn_SubModules SM(NOLOCK)
                        INNER JOIN TblMst_Page P(NOLOCK)
                            ON P.SNo = SM.InPageModuleId AND P.IsActive= 1
                        WHERE SM.inModuleID = EM.inModuleID
                        AND EM.btIsActive = 1 AND SM.btIsActive = 1
                        AND SM.InParantID IS NULL
                        FOR JSON PATH
                ) AS SubModuleList 
                FROM TblTrn_EditionModules EM (NOLOCK) 
                INNER JOIN TblMst_Page P(NOLOCK)
                    ON P.SNo = EM.InPageModuleId AND P.IsActive= 1
                INNER JOIN TblTrn_EditionDependancy ED(NOLOCK)
                    ON EM.inEditionID = ED.inEditionID
                    AND EM.btIsActive = 1 AND ED.btIsActive = 1
                WHERE ED.inDependantEditionID = @EditionId
        END TRY
	    BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END
/*
*************************************************************************************
Procedure Name	:	USP_GetPageModulesList 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   22 Nov 2021
Modified By (On):	
Description		:	
*************************************************************************************
*/

CREATE PROCEDURE USP_GetPageModulesList
AS
    BEGIN
        BEGIN TRY
            SELECT Sno [Id], PageName [DisplayName]
                FROM TblMst_Page P (NOLOCK) 
                WHERE IsActive = 1
                    AND MenuSNO IS NULL AND SubMenuSNo IS NULL


            SELECT Sno [ModuleId],
                (
                    SELECT Sno [Id], PageName [DisplayName], 
                        (
                            SELECT Sno [Id], PageName [DisplayName]
                                FROM TblMst_Page (NOLOCK) 
                                WHERE IsActive = 1
                                AND SubMenuSNo = P1.Sno 
                                FOR JSON PATH
                        ) AS SubSubModuleList
                    FROM TblMst_Page P1 (NOLOCK) 
                        WHERE IsActive = 1
                        AND MenuSNO = P.Sno AND SubMenuSNo IS NULL 
                        FOR JSON PATH
                ) AS SubModuleList 
                FROM TblMst_Page P (NOLOCK) 
                WHERE IsActive = 1
                    AND MenuSNO IS NULL AND SubMenuSNo IS NULL
        END TRY
        BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END

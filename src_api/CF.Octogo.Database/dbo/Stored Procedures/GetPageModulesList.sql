/*
    CREATED ON : 22 Nov 2021
    DESC : 
    DRY RUN : 
                GetPageModulesList 
*/

CREATE PROCEDURE GetPageModulesList
AS
    BEGIN
        SELECT Sno [Id], PageName [DisplayName],NULL AS SubModuleList 
            FROM TblMst_Page P (NOLOCK) 
            WHERE IsActive = 1
                AND MenuSNO IS NULL


        SELECT Sno [ModuleId],
            (
                SELECT Sno [Id], PageName [DisplayName], NULL SubModuleList
                FROM TblMst_Page (NOLOCK) 
                    WHERE IsActive = 1
                    AND MenuSNO = P.Sno 
                    FOR JSON PATH
            ) AS SubModuleList 
            FROM TblMst_Page P (NOLOCK) 
            WHERE IsActive = 1
                AND MenuSNO IS NULL
    END
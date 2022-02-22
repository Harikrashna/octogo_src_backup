/*
    CREATED ON : 25 Nov 2021
    DESC : 
    DRY RUN : 
                Usp_GetAddonDetailsByModuleId 170
*/

CREATE PROCEDURE GetAddonDetailsByModuleId
(
    @ModuleId INT
)
AS
    BEGIN
        SELECT DISTINCT EM.inModuleId [ModuleId], Em.vcModuleName [ModuleName],
            (
                SELECT DISTINCT inSubModuleId [ModuleId], vcSubModuleName [ModuleName]
                    FROM TblTrn_SubModules (NOLOCK)
                    WHERE inModuleId = EM.inModuleId
                        AND btIsActive = 1
                    FOR JSON AUTO
            ) AS SubModuleList
            FROM TblTrn_EditionModules EM(NOLOCK)
            WHERE EM.inModuleId = @ModuleId
            AND EM.btIsActive = 1
    END

 




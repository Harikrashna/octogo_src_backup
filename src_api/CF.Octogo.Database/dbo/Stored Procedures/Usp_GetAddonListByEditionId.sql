/*
    CREATED ON : 23 Nov 2021
    DESC : 
    DRY RUN : 
                Usp_GetAddonListByEditionId 84
*/

CREATE PROCEDURE Usp_GetAddonListByEditionId
(
    @EditionId INT
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
            FROM TblTrn_EditionDependancy ED(NOLOCK)
            INNER JOIN TblTrn_EditionModules EM(NOLOCK)
                ON EM.inEditionId = ED.inEditionId
                AND ED.btIsActive = 1 AND EM.btIsActive = 1
            WHERE ED.inDependantEditionId = @EditionId
    END

 




/*
    CREATED ON : 08 Nov 2021
    DESC : 
    DRY RUN : 
        EXEC GETEDITIONMODULES 78, 0
*/

    CREATE PROCEDURE GETEDITIONMODULES
    (
        @EditionId INT,
        @ForEdit BIT = 1
    )
    AS  
        BEGIN
                -- Get Dependent heirarchy of edition
                ; WITH Dependency_CTE AS
                (
                    SELECT inDependantEditionID, inEditionID 
                        FROM TblTrn_EditionDependancy (NOLOCK) 
                        WHERE btIsActive = 1 and inEditionID = @EditionId
                    UNION ALL
                    SELECT  ED.inDependantEditionID, ED.inEditionID 
                        FROM TblTrn_EditionDependancy ED (NOLOCK)
                        INNER JOIN Dependency_CTE CTE 
                            ON CTE.inDependantEditionID = ED.inEditionID
                        WHERE ED.btIsActive = 1
                )
                SELECT DISTINCT E.Id,E.DisplayName 
                    INTO #DependentEditions
                    FROM Dependency_CTE CTE
                    INNER JOIN AbpEditions E (NOLOCK)
                        ON E.Id = CTE.inDependantEditionID AND E.IsDeleted = 0

                -- Get Modules data of dependent heirarchy
                SELECT DE.Id, DE.DisplayName,EM.inModuleID [ModuleId], EM.vcModuleName [ModuleName], InPageModuleId 
                    INTO #DependentEditionModules
                    FROM TblTrn_EditionModules EM (NOLOCK)
                    INNER JOIN #DependentEditions DE 
                        ON EM.inEditionID = DE.Id AND EM.btIsActive = 1


                 SELECT inModuleID [ModuleId], vcModuleName [ModuleName],PG.SNo [PageModuleId],
                        (SELECT inSubModuleID [SubModuleId], vcSubModuleName [ModuleName] ,P.SNo [PageModuleId]
                            FROM TblTrn_SubModules SM (NOLOCK)
                            INNER JOIN TblMst_Page P(NOLOCK)
                                ON P.SNo = SM.InPageModuleId AND P.IsActive= 1
                            WHERE SM.inModuleId = EM.inModuleId AND btIsActive = 1
                            FOR JSON PATH
                        ) AS SubModuleList
                    FROM TblTrn_EditionModules EM (NOLOCK)
                    INNER JOIN TblMst_Page PG(NOLOCK)
                        ON PG.SNo = EM.InPageModuleId AND PG.IsActive= 1
                    LEFT JOIN #DependentEditionModules DEM
                        ON DEM.ModuleName = EM.vcModuleName
                    WHERE EM.inEditionID = @EditionId AND btIsActive = 1
                        AND DEM.ModuleId IS NULL

                IF(@ForEdit = 0)
                    BEGIN
                        INSERT INTO #DependentEditionModules(Id, DisplayName, ModuleId, ModuleName, InPageModuleId)
                            SELECT E.id, E.DisplayName, EM.inModuleID, EM.vcModuleName, InPageModuleId 
                            FROM TblTrn_EditionModules EM (NOLOCK)
                                INNER JOIN AbpEditions E 
                                    ON EM.inEditionID = E.Id AND EM.btIsActive = 1
                                WHERE E.id = @EditionId AND E.IsDeleted = 0
                    END

                    SELECT DISTINCT Id [EditionId], DisplayName,
                            (SELECT ModuleId, ModuleName,PG.SNo [PageModuleId],
                                    (SELECT inSubModuleID [SubModuleId], vcSubModuleName [SubModuleName],P.SNo [PageModuleId] 
                                        FROM TblTrn_SubModules SM (NOLOCK)
                                        INNER JOIN TblMst_Page P(NOLOCK)
                                            ON P.SNo = SM.InPageModuleId AND P.IsActive= 1
                                        WHERE SM.inModuleId = EM.ModuleId AND btIsActive = 1
                                        FOR JSON PATH
                                    ) AS subModuleList 
                                FROM #DependentEditionModules EM
                                INNER JOIN TblMst_Page PG(NOLOCK)
                                    ON PG.SNo = EM.InPageModuleId AND PG.IsActive= 1
                                    WHERE Id = DEM.Id
                                    FOR JSON PATH) AS ModuleData
                        FROM #DependentEditionModules DEM
                        ORDER BY Id DESC
                                   
        END
                
                -- PageModuleId
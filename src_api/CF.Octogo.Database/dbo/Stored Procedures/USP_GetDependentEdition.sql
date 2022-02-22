/*
    CREATED ON : 08 Nov 2021
    DESC : 
    DRY RUN : 
        EXEC USP_GetDependentEdition 65
*/

    CREATE PROCEDURE USP_GetDependentEdition
    (
        @EditionId INT
    )
    AS  
        BEGIN
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
            SELECT DISTINCT CTE.inDependantEditionID [DependantEditionID], E.Id [EditionId],E.DisplayName 
                FROM Dependency_CTE CTE
                INNER JOIN AbpEditions E (NOLOCK)
                    ON E.Id = CTE.inDependantEditionID AND E.IsDeleted = 0
        END
                

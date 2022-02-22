/*
    CREATED ON : 08 Nov 2021
    DESC : 
    DRY RUN : 
        EXEC USP_CheckEditionDependency 61
*/

    CREATE PROCEDURE USP_CheckEditionDependency
    (
        @EditionId INT
    )
    AS  
        BEGIN
            SELECT COUNT(inEditionID) EditionCounts  FROM TblTrn_EditionDependancy 
                WHERE inDependantEditionID = @EditionId AND btIsActive = 1
        END

                

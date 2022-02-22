/*
    CREATED ON : 05 Nov 2021
    DESC : 
    DRY RUN : 
                GETOTHERDATAFOREDITION
*/

CREATE PROCEDURE GETOTHERDATAFOREDITION
AS
    BEGIN
        SELECT inApproachID [Id], vcApproachName [ApproachName] 
            FROM TblMst_PricingApproach (NOLOCK)
            WHERE btIsActive = 1

        SELECT inProductId [Id], vcProductName [ProductName] 
            FROM TblMst_Product (NOLOCK)
            WHERE btIsActive = 1
    END
/*
    CREATED ON : 05 Nov 2021
    DESC : 
    DRY RUN : 
                USP_GetEditionsByProductId 1,57,'FREE'
*/

CREATE PROCEDURE USP_GetEditionsByProductId
(
    @ProductId INT,
    @EditionId INT = NULL,
    @PaidStatus VARCHAR(10) = NULL      -- 'FREE'/'PAID'
)
AS
    BEGIN
        SELECT DISTINCT E.Id [Id], E.DisplayName [DisplayName], E.Name [Name]
            FROM AbpEditions E (NOLOCK)
            INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)
                ON E.Id = PEM.inEditionId
                AND E.IsDeleted = 0 AND PEM.btIsActive = 1
            LEFT JOIN TblTrn_EditionPricing_Prepaid EPP (NOLOCk)
                ON EPP.inEditionID = E.Id AND EPP.btIsActive = 1
            WHERE PEM.inProductId = @ProductId 
            AND (ISNULL(@EditionId,0)=0 OR (@PaidStatus IS NULL AND E.Id <> @EditionId) OR (@PaidStatus IS NOT NULL AND E.Id = @EditionId))
            AND (@PaidStatus IS NULL OR 
               (@PaidStatus='FREE' AND EPP.inEditionID IS NULL)
                OR (@PaidStatus='PAID' AND EPP.inEditionID IS NOT NULL))
    END
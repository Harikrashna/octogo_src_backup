/*
    CREATED ON : 09 Nov 2021
    DESC : 
    DRY RUN : 
        -- EXEC GetEditionsList @PageSize=10,@Sorting='' @filter='test'
*/

    CREATE PROCEDURE GetEditionsList
    (
        @PageSize INT,
        @SkipCount INT = 0,
        @Sorting VARCHAR(100) = NULL,
        @Filter VARCHAR(MAX) = NULL
    )
    AS  
        BEGIN
            SELECT * FROM 
            (
                SELECT DISTINCT E.Id, E.Name, E.DisplayName, E.WaitingDayAfterExpire, E.TrialDayCount,
                    ExpE.DisplayName [ExpiringEditionDisplayName], P.vcProductName [ProductName],
                    CASE WHEN EPP.inEditionPricingID IS NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END [isFree]
                    FROM AbpEditions E (NOLOCK)
                    INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)
                        ON E.id = PEM.inEditionId 
                        AND E.IsDeleted = 0 AND PEM.btIsActive = 1
                    INNER JOIN TblMst_Product P (NOLOCK)
                        ON P.inProductID = PEM.inProductID AND P.btIsActive = 1
                    LEFT JOIN AbpEditions ExpE (NOLOCK)
                        ON E.ExpiringEditionId = ExpE.Id 
                        AND ExpE.IsDeleted = 0
                    LEFT JOIN TblTrn_EditionPricing_Prepaid EPP (NOLOCK)
                        ON EPP.inEditionId = E.Id 
                        AND EPP.btIsActive = 1
                    WHERE ISNULL(@Filter,'')='' 
                        OR (E.DisplayName IS NOT NULL AND E.DisplayName LIKE '%'+@Filter+'%')
                        OR (P.vcProductName IS NOT NULL AND P.vcProductName LIKE '%'+@Filter+'%')
                        OR (ExpE.DisplayName IS NOT NULL AND ExpE.DisplayName LIKE '%'+@Filter+'%')
            ) AS AllData
                    ORDER BY
                        CASE WHEN ISNULL(@Sorting,'')='' THEN Id END,
                        CASE WHEN UPPER(@Sorting) = 'EDITIONNAME ASC' THEN DisplayName END,
                        CASE WHEN UPPER(@Sorting) = 'PRODUCTNAME ASC' THEN ProductName END,
                        CASE WHEN UPPER(@Sorting) = 'PRICE ASC' THEN isFree END,

                        CASE WHEN UPPER(@Sorting) = 'EDITIONNAME DESC' THEN DisplayName END DESC,
                        CASE WHEN UPPER(@Sorting) = 'PRODUCTNAME DESC' THEN ProductName END DESC,
                        CASE WHEN UPPER(@Sorting) = 'PRICE DESC' THEN isFree END DESC
                OFFSET @SkipCount ROWS
                FETCH NEXT @PageSize ROWS ONLY

            SELECT COUNT(Id) AS totalCount FROM
                     (
                        SELECT DISTINCT E.Id 
                            FROM AbpEditions E (NOLOCK)
                            INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)
                                ON E.id = PEM.inEditionId
                                AND E.IsDeleted = 0 AND PEM.btIsActive = 1
                            INNER JOIN TblMst_Product P (NOLOCK)
                                ON P.inProductID = PEM.inProductID AND P.btIsActive = 1
                            LEFT JOIN AbpEditions ExpE (NOLOCK)
                                ON E.ExpiringEditionId = ExpE.Id 
                                AND ExpE.IsDeleted = 0
                            WHERE ISNULL(@Filter,'')='' 
                                OR (E.DisplayName IS NOT NULL AND E.DisplayName LIKE '%'+@Filter+'%')
                                OR (P.vcProductName IS NOT NULL AND P.vcProductName LIKE '%'+@Filter+'%')
                                OR (ExpE.DisplayName IS NOT NULL AND ExpE.DisplayName LIKE '%'+@Filter+'%')
                      ) AS DataCount

        END
                
/*
*************************************************************************************
Procedure Name	:	Usp_GetAddonsList 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	
Author			:	Hari Krashna
Created On		:   23 Nov 2021
Modified By (On):	Hari Krashna(13/01/2022)
Description		:	
EXEC Usp_GetAddonsList @PageSize=10,@SkipCount=0,@Sorting='AddonName DESC',@Filter='tes'
*************************************************************************************
*/

    CREATE PROCEDURE [Usp_GetAddonsList]
    (
        @PageSize INT,
        @SkipCount INT = 0,
        @Sorting VARCHAR(100) = NULL,
        @Filter VARCHAR(MAX) = NULL
    )
    AS  
            BEGIN
                BEGIN TRY
                    SET NOCOUNT ON;
                        SELECT AD.[inAddOnID] [AddonId], AD.[vcAddOnName] [AddonName], AD.vcDescription [Description],
                            ForE.Id [ForEditionId], ForE.DisplayName [ForEditionName],
                            AD.btIsStandAlone [IsStandAlone], P.inProductId [ProductId], P.vcProductName [Product], 
                            Pricing.isFree [isFree], AAM.inApproachID [ApproachId]
                            FROM TblTrn_Addon AD (NOLOCK)
                            INNER JOIN AbpEditions ForE (NOLOCK)
                                ON ForE.Id = AD.inEditionId 
                                AND ForE.IsDeleted = 0 AND AD.btIsActive = 1
                            INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK)
                                ON PEM.inEditionId = ForE.Id AND PEM.btIsActive = 1
                            INNER JOIN TblMst_Product P(NOLOCK)
                                ON PEM.inProductId = P.inProductId AND P.btIsActive = 1
                            INNER JOIN TblTrn_ApproachAddOnMapping AAM(NOLOCK)
                                ON AAM.inAddOnID = AD.inAddOnID AND AAM.btIsActive = 1
                            INNER JOIN
                                (
                                    SELECT DISTINCT AD.inAddonId [AddonId],
                                            CASE WHEN APP.inAddonPricingId IS NULL THEN CAST(1 AS BIT)
                                                ELSE CAST(0 AS BIT) END AS [isFree]
                                        FROM TblTrn_Addon AD(NOLOCK)
                                        LEFT JOIN TblTrn_AddOnPricing_Prepaid APP(NOLOCK)
                                            ON APP.inAddonId = AD.inAddonId AND APP.btIsActive = 1			
                                )AS Pricing 
                                ON Pricing.AddonId = AD.inAddonId
                            WHERE ISNULL(@Filter,'')='' 
                                OR (AD.vcAddOnName+''+ForE.DisplayName+''+P.vcProductName  LIKE '%'+@Filter+'%')
                            ORDER BY 
                                CASE WHEN ISNULL(@Sorting,'')='' THEN AD.inAddOnID END,
                                CASE WHEN UPPER(@Sorting) = 'ADDONNAME ASC' THEN AD.vcAddOnName END,
                                CASE WHEN UPPER(@Sorting) = 'FORTHEEDITION ASC' THEN ForE.DisplayName END,
                                CASE WHEN UPPER(@Sorting) = 'PRODUCTNAME ASC' THEN P.vcProductName END,
                                CASE WHEN UPPER(@Sorting) = 'STANDALONE ASC' THEN AD.btIsStandAlone END,
                                CASE WHEN UPPER(@Sorting) = 'PRICE ASC' THEN Pricing.isFree END,

                                CASE WHEN UPPER(@Sorting) = 'ADDONNAME DESC' THEN AD.vcAddOnName END DESC,
                                CASE WHEN UPPER(@Sorting) = 'FORTHEEDITION DESC' THEN ForE.DisplayName END DESC,
                                CASE WHEN UPPER(@Sorting) = 'PRODUCTNAME DESC' THEN P.vcProductName END DESC,
                                CASE WHEN UPPER(@Sorting) = 'STANDALONE DESC' THEN AD.btIsStandAlone END DESC,
                                CASE WHEN UPPER(@Sorting) = 'PRICE DESC' THEN Pricing.isFree END DESC

                            OFFSET @SkipCount ROWS
                            FETCH NEXT @PageSize ROWS ONLY

                        SELECT COUNT(AD.inAddOnID) AS totalCount 
                            FROM TblTrn_Addon AD (NOLOCK)
                            INNER JOIN AbpEditions ForE (NOLOCK)
                                ON ForE.Id = AD.inEditionId 
                                AND ForE.IsDeleted = 0 AND AD.btIsActive = 1
                            INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK)
                                ON PEM.inEditionId = ForE.Id AND PEM.btIsActive = 1
                            INNER JOIN TblMst_Product P(NOLOCK)
                                ON PEM.inProductId = P.inProductId AND P.btIsActive = 1
                            INNER JOIN TblTrn_ApproachAddOnMapping AAM(NOLOCK)
                                ON AAM.inAddOnID = AD.inAddOnID AND AAM.btIsActive = 1
                            WHERE ISNULL(@Filter,'')='' 
                                OR (AD.vcAddOnName+''+ForE.DisplayName +''+P.vcProductName  LIKE '%'+@Filter+'%')
            END TRY
            BEGIN CATCH
	            DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	            SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	            RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
            END CATCH
        END
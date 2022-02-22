/*  
*************************************************************************************  
Procedure Name : USP_GetEditionAndAddonPricingData 2, '4,5'   
Purpose      :   
Company      :   CargoFlash InfoTech.   
Scope   :    
Author   : Hari Krashna  
Created On  :  10 Feb 2022 
Modified By (On):   
Description  :   
*************************************************************************************  
*/  
  
CREATE PROCEDURE USP_GetEditionAndAddonPricingData  
(  
    @EditionId INT,
	@AddonIds VARCHAR(MAX) = NULL
)  
AS  
BEGIN  
    BEGIN TRY  
        SELECT E.Id [EditionId], E.DisplayName [EditionName],PEM.inProductID [ProductId], P.vcProductName [ProductName],
            (  
                SELECT EPP.inEditionPricingID [EditionPricingID],EPP.inPricingTypeID [PricingTypeID],  
                    EPP.dcAmount [Amount], EPP.dcDiscountPercentage [DiscountPercentage],  
                    PT.vcTypeName [PricingTypeName], PT.inNoOfDays [NoOfDays]  
                    FROM TblTrn_EditionPricing_Prepaid EPP(NOLOCK)  
                    INNER JOIN TblMst_PricingType PT(NOLOCK)  
                        ON PT.inPricingTypeID = EPP.inPricingTypeID   
                        AND PT.btIsActive = 1   
                    WHERE EPP.inEditionID =  @EditionId AND EPP.btIsActive = 1  
                    FOR JSON PATH  
            ) AS PricingData              
            FROM AbpEditions E (NOLOCK) 
            INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)  
                ON PEM.inEditionID = E.Id AND PEM.btIsActive = 1 
			INNER JOIN TblMst_Product P(NOLOCK)
				ON P.inProductid = PEM.inProductId AND P.btisActive = 1
			WHERE E.Id = @EditionId AND IsDeleted = 0  

			IF(ISNULL(@AddonIds,'') <> '')
				BEGIN
					DECLARE @Addon TABLE(Id INT)
					INSERT INTO @Addon(Id)
						SELECT [value] FROM string_split(@AddonIds,',')
		            SELECT AD.inAddOnID [AddonId], AD.vcAddOnName [AddonName],PEM.inProductID [ProductId], P.vcProductName [ProductName],
                        (  
                            SELECT APP.inAddonPricingID [AddonPricingID],APP.inPricingTypeID [PricingTypeID],  
                                APP.dcAmount [Amount], APP.dcDiscountPercentage [DiscountPercentage],  
                                PT.vcTypeName [PricingTypeName], PT.inNoOfDays [NoOfDays]  
                                FROM TblTrn_AddonPricing_Prepaid APP(NOLOCK)  
                                INNER JOIN TblMst_PricingType PT(NOLOCK)  
                                    ON PT.inPricingTypeID = APP.inPricingTypeID   
                                    AND PT.btIsActive = 1   
                                WHERE APP.inAddOnID =  AD.inAddOnID AND APP.btIsActive = 1  
                                FOR JSON PATH  
                        ) AS PricingData              
                        FROM TblTrn_AddOn AD (NOLOCK)
						INNER JOIN @Addon A 
							ON A.Id = AD.inAddOnID
							AND AD.btIsActive = 1
                        INNER JOIN TblTrn_ProductEditionMapping PEM (NOLOCK)  
                            ON PEM.inEditionID = AD.inEditionID AND PEM.btIsActive = 1 
		            	INNER JOIN TblMst_Product P(NOLOCK)
		            		ON P.inProductid = PEM.inProductId AND P.btisActive = 1
		            	
				END


    END TRY  
    BEGIN CATCH  
     DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT  
     SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()  
     RAISERROR(@ERRMSG, @ERRSEVERITY, 1)  
    END CATCH     
END
/*  
    CREATED ON : 12 Nov 2021  
    DESC :  This is for Pricing Approach 
    DRY RUN :   
                GetPricingApproach  
*/  
  
CREATE PROCEDURE GetPricingApproach
AS  
    BEGIN  
        SELECT inApproachID [Id] ,vcApproachName [ApproachName]  ,vcDescription [Description]  
            FROM TblMst_PricingApproach (NOLOCK)  
            WHERE btIsActive = 1  

    END

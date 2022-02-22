 /*  
 CREATED ON : 24/11/2021 
 CREATED BY:  Gourav
 DESC:   
 DRY RUN :   
 [USP_GetPricingTypes] @MaxResultCount=1, @SkipCount=0  
  
 */  
CREATE PROCEDURE [dbo].[USP_GetPricingTypes] 
(   
    @MaxResultCount int,  
    @SkipCount int,  
    @Sort VARCHAR(30) = NULL,
    @Filter VARCHAR(30) = NULL
    
)
AS      
    BEGIN  
        DECLARE @Sql VARCHAR(MAX)=''  
            IF(@Sort IS NULL)  
                BEGIN   
                 SET @Sort = 'vcTypeName';  
                END  
            SET @Sql = @Sql + '  
               SELECT inPricingTypeID [PricingTypeId], vcTypeName [TypeName] ,inNoOfDays [NoOfDays]      
                FROM TblMst_PricingType (NOLOCK)      
                WHERE btIsActive = 1 
                AND (vcTypeName like ''%'+ISNULL(@Filter,'')+'%''or inNoOfDays like ''%'+ISNULL(@Filter,'')+'%'' )'  
        
                  
            SET @Sql = @Sql + 'ORDER BY '+ @Sort   
            SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS  
                FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'  
  
        EXEC(@Sql)  
  
        SELECT COUNT(inPricingTypeID) [totalCount]   
         FROM TblMst_PricingType(NOLOCK)  
         WHERE btIsActive=1  
         AND (vcTypeName like '%'+ISNULL(@Filter,'')+'%' or inNoOfDays like '%'+ISNULL(@Filter,'')+'%' )

    END  
  
  
  
  
  
  
  
       
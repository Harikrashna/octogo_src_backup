   /* Date: 06/12/2021,
	Name: Vishal Dogra,
	Procedure Name: USP_GetIndustry
	*/
  
  
   
 CREATE PROCEDURE [dbo].[USP_GetIndustry]    
(  
@MaxResultCount int,  
 @SkipCount int,  
 @Sorting varchar(50) =null,  
 @filter varchar(50) =null  
 )  
AS      
    BEGIN      
 DECLARE @Sql VARCHAR(MAX)=''  
  IF(ISNULL(@Sorting,'')='')  
  BEGIN  
   SET @Sorting = 'vcIndustryName';  
  END  
   SET @Sql = @Sql + '  
   SELECT inIndustryID [IndustryId],  
   vcIndustryName [IndustryName],  
   vcDescription [Description]      
            FROM TblMst_Industry (NOLOCK)   
            WHERE  
   btIsActive = 1   
   AND  
   (vcIndustryName like ''%'+ISNULL(@filter,'') + '%''or vcDescription like ''%' + ISNULL(@filter,'')+'%'' ) '  
   SET @Sql = @Sql + 'ORDER BY '+ @Sorting   
    SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS  
         FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'  
  
   EXEC(@Sql)  
  
   SELECT COUNT(inIndustryID) [totalCount]   
    FROM TblMst_Industry(NOLOCK)  
    WHERE btIsActive=1
    AND (vcIndustryName like '%'+ISNULL(@filter,'') + '%' or vcDescription like '%' + ISNULL(@filter,'')+'%' )    
    
    
    END  
   
  
  
    
  
  
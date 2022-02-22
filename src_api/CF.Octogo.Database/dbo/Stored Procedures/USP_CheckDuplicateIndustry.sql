   /* Date: 06/12/2021,
	Name: Vishal Dogra,
	Procedure Name: [USP_CheckDuplicateIndustry] null,'dsfsdf'
	*/
CREATE PROCEDURE [dbo].[USP_CheckDuplicateIndustry]  
 @IndustryID int = null,  
 @IndustryName varchar(50) 
AS  
  BEGIN      
	SET NOCOUNT ON;  
      SELECT vcIndustryName, vcDescription
        FROM TblMst_Industry (NOLOCK) 
        WHERE vcIndustryName=@IndustryName    
          AND btIsActive=1    
		  AND inIndustryID <> ISNULL(@IndustryID,0) 
  END  

 

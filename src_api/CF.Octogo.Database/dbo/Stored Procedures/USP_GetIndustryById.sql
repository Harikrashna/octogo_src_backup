 /* Date: 06/12/2021,
	Name: Vishal Dogra,
	Procedure Name: USP_GetIndustryId
	*/
CREATE PROCEDURE [dbo].[USP_GetIndustryById]
@IndustryId INT
AS
BEGIN
	SELECT    inIndustryID,
			vcIndustryName,  
			vcDescription 
			FROM  
			TblMst_Industry(NOLOCK)  
			WHERE   
			inIndustryID = @IndustryId 
	END  
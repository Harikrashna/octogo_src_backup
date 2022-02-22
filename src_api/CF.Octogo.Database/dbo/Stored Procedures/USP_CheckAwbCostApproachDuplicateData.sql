  
/*
    CREATED ON : 24/11/2021
    CREATED BY : Deepak
    DESC : 
    DRY RUN: 
    USP_CheckAwbCostApproachDuplicateData 1,'AppName',''
*/
CREATE PROCEDURE [dbo].[USP_CheckAwbCostApproachDuplicateData]  
 (
    @ApproachID int = Null,  
    @ApproachName Varchar(50)= NULL
  
 ) 
AS  

	BEGIN  

		SET NOCOUNT ON;  

			SELECT  vcApproachName , vcDescription FROM TblMst_PerAWBCostApproach 
				WHERE vcApproachName = @ApproachName AND btIsActive=1 
					AND inApproachID <> ISNULL(@ApproachID,0) 
	END  


	
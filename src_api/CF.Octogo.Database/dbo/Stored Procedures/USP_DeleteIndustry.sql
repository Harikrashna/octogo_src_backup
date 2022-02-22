   /* Date: 06/12/2021,
	Name: Vishal Dogra,
	Procedure Name: USP_DeleteIndustry
	*/
  
  

 CREATE PROCEDURE [dbo].[USP_DeleteIndustry]
(
	 @IndustryId INT,
 	@UserId BIGINT
) 	
AS
 BEGIN
	BEGIN TRY
		 BEGIN TRANSACTION
		 	UPDATE TblMst_Industry  
		 	SET	btIsActive = 0, 
		 		dtModifiedOn = GETDATE(),
		 		inModifiedBy = @UserId 
		 		WHERE inIndustryID = @IndustryId   
		COMMIT TRANSACTION  
	END TRY  
	BEGIN CATCH  
		IF @@TRANCOUNT > 0  
		 ROLLBACK  
		 DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT  
		 SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY= ERROR_SEVERITY()  

		 RAISERROR(@ERRMSG, @ERRSEVERITY,1)  
 	END CATCH  
 END  
 
/*
    CREATED ON : 24/11/2021
    CREATED BY : Deepak
    DESC : 
    DRY RUN: 
    USP_DeleteAwbCostApproach 1
*/
 CREATE PROCEDURE [dbo].[USP_DeleteAwbCostApproach] 
 (
     @AwbCostApproachId INT,
     @UserId bigint
 ) AS 
 BEGIN 
    BEGIN TRY  
        BEGIN TRANSACTION  
            UPDATE TblMst_PerAWBCostApproach 
            SET btIsActive=0,
            dtModifiedOn = GETDATE(),
            inModifiedBy = @UserId 
            WHERE inApproachID = @AwbCostApproachId    
        COMMIT TRANSACTION  
    END TRY  
    BEGIN CATCH  
       IF @@TRANCOUNT>0  
       ROLLBACK  
       DECLARE @ERRMSG NVARCHAR(4000) , @ERRSEVERITY INT  
       SELECT @ERRMSG = ERROR_MESSAGE() ,@ERRSEVERITY=ERROR_SEVERITY()  
  
       RAISERROR(@ERRMSG, @ERRSEVERITY , 1)  
    END CATCH 
END     
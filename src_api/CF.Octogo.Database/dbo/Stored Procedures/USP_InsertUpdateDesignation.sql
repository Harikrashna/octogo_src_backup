/*
Created by:Merajuddin khan
Created on:05 dec 2021
dry run exec USP_InsertUpdateDesignation DesignationName='fff',@Description='ggg'
*/

CREATE PROCEDURE [dbo].[USP_InsertUpdateDesignation]
    (
	@DesignationId INT,
    @DesignationName VARCHAR(100),
	@Description VARCHAR(250),
	@LoginBy BIGINT
	)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
              IF(ISNULL(@DesignationId,0)=0)
                 BEGIN
                        INSERT INTO TblMst_Designation
                                               (
                                                  vcDesignationName,
                                                  vcDescription,
                        						  btIsActive,
                        						  dtCreatedOn,
                        						  inCreatedBy
                                                )
                                                VALUES ( 
                                                  @DesignationName,
                                                  ISNULL(@Description,''),
                        						  1,
                        						  getdate(),
                        						  @LoginBy
                                                 )
                        SELECT @DesignationId = SCOPE_IDENTITY();
                  END  
		ELSE 	
			BEGIN      
                   UPDATE TblMst_Designation
                   SET vcDesignationName = @DesignationName, vcDescription = ISNULL(@Description,''),
			       inModifiedBy=@LoginBy,dtModifiedOn=getdate()
                   WHERE inDesignationID = @DesignationId
			END

            SELECT @DesignationId [Id]
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
                IF @@TRANCOUNT > 0
				ROLLBACK
				DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
				SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
				RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END
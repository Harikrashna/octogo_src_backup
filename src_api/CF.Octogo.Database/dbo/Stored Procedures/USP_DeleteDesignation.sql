
/*
Created by:Merajuddin khan
Created on:05 dec 2021
dry run exec [USP_DeleteDesignation] @DesignationId=1
*/

 CREATE PROCEDURE [dbo].[USP_DeleteDesignation]
    (
        @DesignationId INT,
        @LoginBy INT
    )
    AS  
        BEGIN
            BEGIN TRY
                BEGIN TRANSACTION
                    UPDATE TblMst_Designation 
                        SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginBy
                        WHERE inDesignationID = @DesignationId
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
          
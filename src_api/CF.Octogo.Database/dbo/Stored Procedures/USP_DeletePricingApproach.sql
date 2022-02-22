/*
    CREATED ON : 24/11/2021
    CREATE BY : Merajuddin Khan
    DESC : 
    DRY RUN: 
    USP_DeletePricingApproach 1, 1
*/

 CREATE PROCEDURE [dbo].[USP_DeletePricingApproach]
    (
        @ApproachId INT,
        @LoginBy INT
    )
    AS  
        BEGIN
            BEGIN TRY
                BEGIN TRANSACTION
                    UPDATE TblMst_PricingApproach 
                        SET btIsActive = 0, 
                        dtModifiedOn = GETDATE(), 
                        inModifiedBy = @LoginBy
                        WHERE inApproachID = @ApproachId

                
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
          
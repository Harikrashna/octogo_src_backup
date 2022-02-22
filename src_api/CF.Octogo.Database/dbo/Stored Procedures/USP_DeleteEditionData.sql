/*
    CREATED ON : 08 Nov 2021
    DESC : 
    DRY RUN : 
        EXEC USP_DeleteEditionData 65 , 1
*/

    CREATE PROCEDURE USP_DeleteEditionData
    (
        @EditionId INT,
        @LoginUserId INT
    )
    AS  
        BEGIN
            BEGIN TRY
                BEGIN TRANSACTION
                    UPDATE TblTrn_ApproachEditionMapping 
                        SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                        WHERE inEditionID = @EditionId
                    
                    UPDATE TblTrn_ProductEditionMapping 
                        SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                        WHERE inEditionID = @EditionId

                    UPDATE TblTrn_SubModules 
                        SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                        WHERE inModuleID IN(SELECT InModuleId From TblTrn_EditionModules WHERE inEditionID =  @EditionId AND btIsActive = 1)

                    UPDATE TblTrn_EditionModules 
                        SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                        WHERE inEditionID = @EditionId
                    IF((SELECT COUNT(inEditionID) FROM TblTrn_EditionPricing_Prepaid WHERE inEditionID = @EditionId) > 0)
                        BEGIN
                            UPDATE TblTrn_EditionPricing_Prepaid 
                                SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                                WHERE inEditionID = @EditionId
                        END
                    IF((SELECT COUNT(inEditionId) FROM TblTrn_EditionDependancy(NOLOCK) WHERE inEditionId = @EditionId AND btIsActive = 1) > 0)
                        BEGIN
                            UPDATE TblTrn_EditionDependancy 
                                SET btIsActive = 0, dtModifiedOn = GETDATE(), inModifiedBy = @LoginUserId
                                WHERE inEditionID = @EditionId AND btIsActive = 1
                        END
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
                

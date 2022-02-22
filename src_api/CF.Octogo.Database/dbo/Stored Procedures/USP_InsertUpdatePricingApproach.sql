/*
    CREATED ON : 24/11/2021
    CREATE BY : Merajuddin Khan
    DESC : 
    DRY RUN: 
    USP_InsertUpdatePricingApproach 1, 'name','desc',1
*/
CREATE PROCEDURE [dbo].[USP_InsertUpdatePricingApproach]
    (
	@ApproachId INT,
    @ApproachName VARCHAR(100),
	@Description VARCHAR(250),
	@LoginBy BIGINT
	)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
	
            IF(ISNULL(@ApproachId,0)=0)
                BEGIN
                    INSERT INTO TblMst_PricingApproach
                                (
                                 vcApproachName,
                                 vcDescription,
                    			 btIsActive,
                    			 dtCreatedOn,
                    			 inCreatedBy
                                 )
                                VALUES ( 
                                 @ApproachName,
                                 @Description,
                    			 1,
                    			 GETDATE(),
                    			 @LoginBy
                                )
                    SELECT @ApproachId = SCOPE_IDENTITY();
                END  
		    ELSE 	
                BEGIN      
                       UPDATE TblMst_PricingApproach
                       SET vcApproachName = @ApproachName, vcDescription = @Description,
	            		inModifiedBy=@LoginBy,dtModifiedOn=getdate()
                       WHERE inApproachID = @ApproachId
                END
        SELECT @ApproachId [Id]
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
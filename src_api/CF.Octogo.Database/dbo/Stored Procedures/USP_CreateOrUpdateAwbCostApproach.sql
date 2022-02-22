
/*
    CREATED ON : 24/11/2021
    CREATE BY : Deepak
    DESC : 
    DRY RUN: 
    USP_CreateOrUpdateAwbCostApproach 1,'AppName',''
*/
CREATE PROCEDURE [dbo].[USP_CreateOrUpdateAwbCostApproach] 
	@inApproachID int = null,
	@vcApproachName varchar(100),
	@vcDescription varchar(250),
        @UserId bigint


AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION

            IF(ISNULL(@inApproachID,0)=0)
                BEGIN
                	Insert into TblMst_PerAWBCostApproach(vcApproachName,vcDescription,btIsActive,dtCreatedOn,inCreatedBy)
                        VALUES(@vcApproachName,@vcDescription,1,GETDATE(),@UserId)

                    SELECT @inApproachID = SCOPE_IDENTITY();
                END
            ELSE
                Begin
                	UPDATE TblMst_PerAWBCostApproach 
                        SET vcApproachName=@vcApproachName,
                        vcDescription=@vcDescription , 
                        dtModifiedOn=GETDATE(), 
                        inModifiedBy=@UserId 
                        WHERE inApproachID=@inApproachID

                END

                SELECT @inApproachID [Id]
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
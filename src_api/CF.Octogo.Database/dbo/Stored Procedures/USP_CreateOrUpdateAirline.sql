/*
	CREATED BY: Manav
	CREATED ON: 07/12/2021
	DESC
*/


CREATE PROCEDURE [dbo].[USP_CreateOrUpdateAirline] 
	@inAirlineID INT = null,
	@vcAirlineName VARCHAR(100),
	@vcDescription VARCHAR(250),
	@UserId BIGINT
AS
	BEGIN
		BEGIN TRY
			BEGIN TRANSACTION
				IF(ISNULL(@inAirlineID,0)=0)
					BEGIN

						INSERT INTO TblMst_Airline
									(
									AirlineName,
									Address,
									IsActive,
									CreatedOn,
									CreatedBy
									)
									VALUES
									(
									@vcAirlineName,
									ISNULL(@vcDescription,''),
									1,
									GETDATE(),
									@UserId
									)
                        SELECT @inAirlineID = SCOPE_IDENTITY()
					END
				ELSE
					BEGIN
							UPDATE TblMst_Airline
							SET
							AirlineName=@vcAirlineName ,
							Address=ISNULL(@vcDescription,''),
							UpdatedOn=GETDATE(),
							UpdatedBy=@UserId
							WHERE Sno=@inAirlineID AND IsActive = 1

					END

                SELECT @inAirlineID [Id]
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

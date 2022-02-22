/*
*************************************************************************************
Procedure Name	:	USP_DeleteAddon
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Hari Krashna
Created On		:   14/01/2022
Modified By (On):	Hari Krashna(04/02/2022)
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_DeleteAddon]
(
	@AddonId INT,
	@UserId BIGINT
)
AS
BEGIN
    BEGIN TRY
        DECLARE @Msg VARCHAR(100);
		BEGIN TRANSACTION
            IF((SELECT COUNT(inMappingID) FROM TblTrn_TenantEditionAddOnMapping(NOLOCK) WHERE inAddOnID = @AddonId AND btIsActive = 1) = 0)
                BEGIN
	                UPDATE TblTrn_AddOn 
                        SET btIsActive = 0,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @UserId 
                        WHERE inAddOnID = @AddonId AND btIsActive = 1

                    UPDATE TblTrn_ApproachAddOnMapping 
                        SET btIsActive = 0,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @UserId 
                        WHERE inAddOnID = @AddonId AND btIsActive = 1

                    UPDATE TblTrn_AddonModule_SubModule_SubSubModuleMapping 
                        SET btIsActive = 0,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @UserId 
                        WHERE inAddOnID = @AddonId AND btIsActive = 1

                    UPDATE TblTrn_AddonPricing_Prepaid 
                        SET btIsActive = 0,
                        dtModifiedOn = GETDATE(),
                        inModifiedBy = @UserId 
                        WHERE inAddOnID = @AddonId AND btIsActive = 1

                    SET @Msg = 'Success';
            END
            ELSE
                BEGIN
                    SET @Msg = 'ThereAreTenantsSubscribedToThisAddon';
                END
        SELECT @Msg [Msg] 
	    COMMIT TRANSACTION
	END TRY
    BEGIN CATCH
        ROLLBACK
		DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
		SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
		RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END



/*
*************************************************************************************
Procedure Name	:	USP_InsertUpdateTenantEditionAddonDetails 
Purpose		    :	Insert/Update Edition,Addon, Approach and pricing details for tenant
Company		    :   CargoFlash InfoTech. 
Scope			:	
Author			:	Hari Krashna
Created On		:   20 Jan 2022
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE USP_InsertUpdateTenantEditionAddonDetails
(
    @TenantId INT,
    @EditionId INT = NULL,
    @isEdit BIT = 0,
    @LoginUserId BIGINT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION 
            SET NOCOUNT ON;

            IF(@isEdit = 0)
                BEGIN
                    IF(ISNULL(@EditionId,0) > 0)
                        BEGIN
                            INSERT INTO TblTrn_TenantEditionAddOnMapping
                                (inTenantID, inEditionID, dtStartDate, btIsActive, inCreatedBy, dtCreatedOn)
                                SELECT @TenantId, @EditionId, GETUTCDATE(), 1, @LoginUserId, GETDATE() 

                            INSERT INTO TblTrn_TenantEditionApproachMapping
                                (inTenantID, inEditionID, inApproachID, btIsActive, dtCreatedOn, inCreatedBy)
                                SELECT @TenantId, inEditionId, inApproachID, 1, GETDATE(), @LoginUserId
                                    FROM TblTrn_ApproachEditionMapping
                                    WHERE inEditionID = @EditionId AND btIsActive = 1
                            IF((SELECT COUNT(inPricingTypeID) FROM TblTrn_EditionPricing_Prepaid(NOLOCK) 
                                                                WHERE  inEditionID = @EditionId AND btIsActive = 1) > 0)
                                BEGIN
                                    INSERT INTO TblTrn_TenantEditionPricing_Prepaid
                                        (inTenantID, inEditionID, inPricingTypeID, dcAmount, dcDiscountPercentage, btIsActive, inCreatedBy, dtCreatedOn)
                                        SELECT @TenantId, @EditionId, inPricingTypeID, dcAmount, dcDiscountPercentage, 1, @LoginUserId, GETDATE()
                                            FROM TblTrn_EditionPricing_Prepaid
                                            WHERE inEditionID = @EditionId AND btIsActive = 1
                                END

                            -- TblTrn_TenantEditionAddOnMapping
                            -- TblTrn_TenantAddOnApproachMapping				
                            -- TblTrn_TenantAddOnPricing_Prepaid				
                        END
                END
          
            SELECT @TenantId [Id]
        COMMIT TRANSACTION
    END TRY
    BEGIN CATCH
                --IF @@TRANCOUNT > 0
				ROLLBACK
		  
				DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
				SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()

				RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END
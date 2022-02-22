/*
    CREATED BY: HARI KRASHNA
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_CreateUserDetailedRegistration

*/
CREATE PROCEDURE USP_CreateUserDetailedRegistration
(
    @UserTypeId INT,
    @UserId INT,
    @CompanyName VARCHAR(120),
    @AirlineId INT = NULL,
    @DepartmentId INT,
    @Department VARCHAR(100)= NULL,
    @DesignationId INT = NULL,
    @Designation VARCHAR(100)= NULL,
    @Services VARCHAR(100)=NULL,
    @City INT,
    @Country INT,
    @Contact NVARCHAR(15),
    @RepresentingAirlines VARCHAR(100),
    @RepresentingCountries VARCHAR(100),
    @IndustryId INT=NULL,
    @Industry VARCHAR(100)= NULL,
    @LoginUserId INT
)
AS 
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION
                SET NOCOUNT ON;
                DECLARE @UserDetailId INT;
                INSERT INTO TblTrn_UserDetails (inUserID, inUserTypeID, vcFirstName, vcLastName, vcCompanyName,
                    inAirlineID, inDepartmentID, vcDepartmentName, inDesignationID, vcDesignation, vcServicesLookingFor,
                    inCityID, inCountryID, vcContact, vcRepresentingAirlines,vcRepresentingCountries, inIndustryID,
                    vcIndustryName, btIsActive, inCreatedBy, dtCreatedOn)
                SELECT @UserId, @UserTypeId, Name, Surname, @CompanyName,
                    @AirlineId, @DepartmentId, ISNULL(@Department,''), @DesignationId, ISNULL(@Designation,''), ISNULL(@Services,''),
                    @City, @Country, @Contact, ISNULL(@RepresentingAirlines,''), ISNULL(@RepresentingCountries,''), @IndustryId,
                    ISNULL(@Industry,''), 1, ISNULL(@LoginUserId,0), GETDATE()
                FROM AbpUsers WHERE Id = @UserId AND IsDeleted = 0 AND IsActive = 1

                SELECT @UserDetailId = SCOPE_IDENTITY();

                SELECT @UserDetailId [UserDetailId]
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


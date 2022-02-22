/*
    CREATED BY: HARI KRASHNA
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_CreateUserDetailedRegistration

*/
CREATE PROCEDURE USP_CreateUserDetailedRegistration_backup
(
    @UserTypeId INT,
    @UserId INT,
    @CompanyName VARCHAR(120),
    @AirlineId INT,
    @DepartmentId INT,
    @Department VARCHAR(100)= NULL,
    @DesignationId INT,
    @Designation VARCHAR(100)= NULL,
    @Services VARCHAR(100),
    @City INT,
    @Country INT,
    @Contact NVARCHAR(15),
    @RepresentingAirlines VARCHAR(100),
    @RepresentingCountries VARCHAR(100),
    @IndustryId INT,
    @Industry VARCHAR(100)= NULL,
    @ConnectionString VARCHAR(200),
    @LoginUserId INT
)
AS 
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION
                SET NOCOUNT ON;
                DECLARE @TenentId INT, @EditionId INT = 1, @AdminRoleId INT;

                -- CREATE Tenent Here
                INSERT INTO AbpTenants(ConnectionString, EditionId, Name, TenancyName, IsActive, IsDeleted, CreationTime, CreatorUserId)
                    VALUES(@ConnectionString, @EditionId, @CompanyName, @CompanyName, 1, 0, GETDATE(), @LoginUserId)
                SELECT @TenentId = SCOPE_IDENTITY();
                
                -- Link User- Tenent here
                UPDATE AbpUsers SET TenantId = @TenentId WHERE Id = @UserId AND IsDeleted = 0

                -- Create Admin Role for new Tenent here
                -- select * from AbpUserAccounts
                INSERT INTO AbpRoles(ConcurrencyStamp, DisplayName, IsDefault, IsStatic, Name, NormalizedName, TenantId, IsDeleted, CreatorUserId, CreationTime)
                    VALUES('', 'Admin', 1, 1, 'Admin', 'ADMIN', @TenentId, 0, @LoginUserId, GETDATE())
                SELECT @AdminRoleId = SCOPE_IDENTITY();

                -- Update User RoleId Here
                UPDATE AbpUserRoles SET RoleId = @AdminRoleId, TenantId = @TenentId WHERE UserId =@UserId
                
                -- Update AbpUserAccounts here
                UPDATE AbpUserAccounts SET TenantId = @TenentId WHERE UserId =@UserId AND IsDeleted = 0

                INSERT INTO TblTrn_UserDetails (inTenantID, inUserTypeID, vcFirstName, vcLastName, vcCompanyName,
                    inAirlineID, inDepartmentID, vcDepartmentName, inDesignationID, vcDesignation, vcServicesLookingFor,
                    inCityID, inCountryID, vcContact, vcRepresentingAirlines,vcRepresentingCountries, inIndustryID,
                    vcIndustryName, btIsActive, inCreatedBy, dtCreatedOn)
                SELECT @TenentId, @UserTypeId, Name, Surname, @CompanyName,
                    @AirlineId, @DepartmentId, ISNULL(@Department,''), @DesignationId, ISNULL(@Designation,''), ISNULL(@Services,''),
                    @City, @Country, @Contact, ISNULL(@RepresentingAirlines,''), ISNULL(@RepresentingCountries,''), @IndustryId,
                    ISNULL(@Industry,''), 1, ISNULL(@LoginUserId,0), GETDATE()
                FROM AbpUsers WHERE Id = @UserId AND IsDeleted = 0 AND IsActive = 1

                SELECT @TenentId [TenentId]

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


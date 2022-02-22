 /*
*************************************************************************************
Procedure Name	:	
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Deepak
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/ 
CREATE PROCEDURE [dbo].[USP_CreateOrUpdateCity]   
(
    @SNo int = null,  
    @CityCode varchar(3),  
    @CityName varchar(100),   
    @StateSNo int = null,  
    @StateName varchar(100),   
    @CountrySNo int,  
    @CountryCode varchar(2),  
    @CountryName varchar(100),  
    @IsActive bit,  
    @TimeZoneSNo int,  
    @ZoneSNo int = null,  
    @ZoneName varchar(50) = null,  
    @IataAreaCode int=null,  
    @ShcSNo int = null,  
    @DgClassSNo int = null,  
    @PriorApproval bit = null,  
    @IsDayLightSaving bit = null,  
    @UserId bigint  
)    
AS  
BEGIN  
    BEGIN TRY  
        BEGIN TRANSACTION  
            IF(ISNULL(@SNo,0)=0)  
            BEGIN  
                INSERT INTO TblMst_City(CityCode,CityName,StateSNo,StateName,CountrySNo,CountryCode,CountryName,  
                        IsActive,TimeZoneSNo,ZoneSNo,ZoneName,IataArea,ShcSNo,DgClassSNo,PriorApproval,
                        IsDayLightSaving,CreatedOn,CreatedBy)
                    VALUES(@CityCode,@CityName,@StateSNo, @StateName, @CountrySNo,@CountryCode,@CountryName,  
                        @IsActive,@TimeZoneSNo,@ZoneSNo, @ZoneName, @IataAreaCode, @ShcSNo, @DgClassSNo, @PriorApproval,
                        @IsDayLightSaving,GETUTCDATE(),@UserId)  
            END  
            ELSE   
                BEGIN     
                    UPDATE TblMst_City 
                    SET CityCode=@CityCode , 
                    CityName=@CityName ,
                    StateSNo=@StateSNo,
                    StateName=@StateName,
                    CountrySNo=@CountrySNo,
                    CountryCode=CountryCode,
                    CountryName=@CountryName,     
                    IsActive=@IsActive,
                    TimeZoneSNo=@TimeZoneSNo,
                    ZoneSNo=@ZoneSNo,
                    ZoneName=@ZoneName,
                    IataArea=@IataAreaCode,
                    ShcSNo=@ShcSNo,
                    DgClassSNo=@DgClassSNo,
                    PriorApproval=@PriorApproval,
                    IsDayLightSaving=@IsDayLightSaving,
                    UpdatedOn=GETUTCDATE(), 
                    UpdatedBy=@UserId 
                    WHERE SNo=@SNo AND IsActive = 1     
                END  
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
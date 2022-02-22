 /* Date: 06/12/2021,
	Name: Vishal Dogra,
	Procedure Name: USP_CreateOrUpdateIndustry
	*/
  
  
CREATE PROCEDURE [dbo].[USP_CreateOrUpdateIndustry]   
 @inIndustryID INT = null,  
 @vcIndustryName VARCHAR(100),  
 @vcDescription VARCHAR(250),  
 @UserId BIGINT  
AS  
BEGIN
    IF(ISNULL(@inIndustryID,0)=0)  
        BEGIN  
            INSERT INTO TblMst_Industry  
                    (  
                    vcIndustryName,  
                    vcDescription,  
                    btIsActive,  
                    dtCreatedOn,  
                    inCreatedBy  
                    )  
                    VALUES  
                    (  
                    @vcIndustryName,  
                    @vcDescription,  
                    1,  
                    GETDATE(),  
                    @UserId
                    )  
            SELECT @inIndustryID = SCOPE_IDENTITY();       
        END  
        ELSE   
            BEGIN     
                UPDATE TblMst_Industry     
                    SET vcIndustryName=@vcIndustryName ,     
                    vcDescription=@vcDescription ,     
                    dtModifiedOn=GETUTCDATE(),     
                    inModifiedBy=@UserId     
                    WHERE inIndustryID=@inIndustryID
                    AND btIsActive = 1      
        END
    SELECT @inIndustryID [Id]
END
/*
*************************************************************************************
Procedure Name	:	USP_GetTenantProcessLogs
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Hari Krashna
Created On		:   07/02/2022
Modified By (On):	
Description		:	
USP_GetTenantProcessLogs @MaxResultCount = 20,@SkipCount = 0,@TenantName='ui',@TenantId = NULL,@ProductId=NULL,@IsDBSetup=NULL,@IsWSSetup=1
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetTenantProcessLogs]   
(      
    @MaxResultCount INT = 10,    
    @SkipCount INT = 0,    
    @TenantName VARCHAR(100) = NULL,    
    @TenantId INT = NULL,    
    @ProductId INT = NULL,    
    @IsDBSetup BIT = NULL,    
    @IsAppURLSetup BIT = NULL, 
    @IsApiURLSetup BIT = NULL,    
    @IsWSSetup BIT = NULL,    
    @IsAppHosted BIT = NULL,     
    @IsAdminCreated BIT = NULL    
)         
AS      
BEGIN      
    BEGIN TRY   
        SELECT TNT.Id [TenantId], TNT.Name [TenantName], P.inProductID [ProductId], P.vcProductName [ProductName],    
            TSPL.btIsDBSetup [IsDBSetup], TSPL.dtDBSetupComplete [DBSetupCompleteDt], TDB.vcDBName [DBName],    
            TSPL.btIsAppURLSetup [IsAppURLSetup], TSPL.dtAppURLSetupComplete [AppURLSetupCompleteDt],TSPL.vcAppURL [AppURAL],    
            TSPL.btIsWSSetup [IsWSSetup], TSPL.dtWSSetupComplete [WSSetupCompleteDt], 
            TSPL.btIsAPIURLSetup [IsAPIURLSetup], TSPL.dtAPIURLSetupComplete [APIURLSetupCompleteDt], TSPL.vcAPIURL [ApiURL],  
            TSPL.btIsApplicationHost [IsApplicationHost], TSPL.dtApplicationHostCompleted [ApplicationHostDt],
            TSPL.btAdminCreationCompleted [IsAdminCreationCompleted] , TSPL.dtAdminCreationComplete [AdminCreationCompleteDt],
            AU.Name + ' ' + ISNULL(AU.Surname,'') [AdminName], AU.EmailAddress [AdminEmail]
            FROM AbpTenants TNT(NOLOCK)    
            INNER JOIN TblTrn_TenantSetupProcessLog TSPL(NOLOCK)    
                ON TNT.Id = TSPL.inTenantID     
                AND TNT.IsDeleted = 0 AND TSPL.btIsActive = 1 
            INNER JOIN TblTrn_TenantDB TDB(NOLOCK)
                ON TDB.inTenantID = TSPL.inTenantID 
                AND TDB.inProductID = TSPL.inProductID  
            INNER JOIN TblMst_Product P(NOLOCK)    
                ON TSPL.inProductID = P.inProductID    
                AND P.btIsActive = 1   
            INNER JOIN AbpUsers AU(NOLOCK)
                ON AU.TenantId = TNT.Id AND AU.IsDeleted = 0
            INNER JOIN AbpUserRoles AUR(NOLOCK)
                ON AUR.UserId = AU.Id
            INNER JOIN AbpRoles AR(NOLOCK)
                ON AR.Id = AUR.RoleId AND AU.IsDeleted = 0
                AND UPPER(AR.Name) = 'ADMIN'
            WHERE TNT.Id = ISNULL(@TenantId,TNT.Id)    
            AND TSPL.inProductID = ISNULL(@ProductId,TSPL.inProductID)    
            AND TSPL.btIsDBSetup = ISNULL(@IsDBSetup,TSPL.btIsDBSetup)    
            AND TSPL.btIsAppURLSetup = ISNULL(@IsAppURLSetup,TSPL.btIsAppURLSetup)    
            AND TSPL.btIsWSSetup = ISNULL(@IsWSSetup,TSPL.btIsWSSetup)    
            AND TSPL.btIsAPIURLSetup = ISNULL(@IsApiURLSetup,TSPL.btIsAPIURLSetup)    
            AND TSPL.btAdminCreationCompleted = ISNULL(@IsAdminCreated,TSPL.btAdminCreationCompleted)    
            AND ISNULL(TSPL.btIsApplicationHost,0) = ISNULL(@IsAppHosted,ISNULL(TSPL.btIsApplicationHost,0))  
            AND (ISNULL(@TenantName,'') = '' OR TNT.Name LIKE '%'+@TenantName +'%') 
            AND ((CONVERT(date,TSPL.dtCreatedOn) > CONVERT(date, GETDATE()-7)) OR btAdminCreationCompleted = 0)  
            ORDER BY TNT.Id DESC    
    
            OFFSET @SkipCount*@MaxResultCount ROWS    
            FETCH NEXT @MaxResultCount ROWS ONLY  
	  
	  SELECT COUNT(TSPL.inSetupID) [totalRecords] 
            FROM AbpTenants TNT(NOLOCK)    
            INNER JOIN TblTrn_TenantSetupProcessLog TSPL(NOLOCK)    
                ON TNT.Id = TSPL.inTenantID     
                AND TNT.IsDeleted = 0 AND TSPL.btIsActive = 1 
            INNER JOIN TblMst_Product P(NOLOCK)    
                ON TSPL.inProductID = P.inProductID    
                AND P.btIsActive = 1  
            WHERE TNT.Id = ISNULL(@TenantId,TNT.Id)    
            AND TSPL.inProductID = ISNULL(@ProductId,TSPL.inProductID)    
            AND TSPL.btIsDBSetup = ISNULL(@IsDBSetup,TSPL.btIsDBSetup)    
            AND TSPL.btIsAppURLSetup = ISNULL(@IsAppURLSetup,TSPL.btIsAppURLSetup)    
            AND TSPL.btIsWSSetup = ISNULL(@IsWSSetup,TSPL.btIsWSSetup)    
            AND TSPL.btIsAPIURLSetup = ISNULL(@IsApiURLSetup,TSPL.btIsAPIURLSetup)    
            AND TSPL.btAdminCreationCompleted = ISNULL(@IsAdminCreated,TSPL.btAdminCreationCompleted)    
            AND ISNULL(TSPL.btIsApplicationHost,0) = ISNULL(@IsAppHosted,ISNULL(TSPL.btIsApplicationHost,0))   
            AND (ISNULL(@TenantName,'') = '' OR TNT.Name LIKE '%'+@TenantName +'%') 
            AND ((CONVERT(date,TSPL.dtCreatedOn) > CONVERT(date, GETDATE()-7)) OR btAdminCreationCompleted = 0)  

    END TRY    
    BEGIN CATCH    
     DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT    
     SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()    
     RAISERROR(@ERRMSG, @ERRSEVERITY, 1)    
    END CATCH    
    
END
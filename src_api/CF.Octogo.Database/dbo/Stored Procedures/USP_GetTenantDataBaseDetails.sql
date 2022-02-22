/*
*************************************************************************************
Procedure Name	:	USP_GetTenantDataBaseDetails 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Merajuddin
Created On		:   24 Jan 2022
Modified By (On):	
Description		:	
*************************************************************************************
*/

CREATE PROCEDURE [dbo].[USP_GetTenantDataBaseDetails]    
(    
   @TenantId INT = NULL,    
   @AdminCreationCompleted BIT = 0,    
   @IsSetupProcessComplete BIT = 1    
)    
AS     
  BEGIN    
    BEGIN TRY    
        SET NOCOUNT ON;    
        SELECT inSetupId [SetupId],TSP.btIsEmailSend [IsEmailSend], TSP.btAdminCreationCompleted [IsAdminCreationComplete]  , tb.vcConnectionString [ConnectionString], TB.inProductID [ProductId],     
            TB.vcConnectionStringName [ConnectionStringName], TB.vcDBName [DbName], TB.vcProviderName [ProciderName], TSP.inTenantID [TenantId]    
            FROM TblTrn_TenantSetupProcessLog TSP(NOLOCK)    
            INNER JOIN  TblTrn_TenantDB TB (NOLOCK)    
              ON TB.inTenantID = TSP.inTenantID 
              AND TB.inProductID = TSP.inProductID
              AND TB.btIsActive = 1 AND TSP.btIsActive = 1
            INNER JOIN AbpTenants T(NOLOCK)
                ON T.Id = TB.inTenantID AND T.IsDeleted = 0    
            WHERE btIsDBSetup=1     
                AND btIsSetupProcessComplete = @IsSetupProcessComplete     
                AND btAdminCreationCompleted = ISNULL(@AdminCreationCompleted, btAdminCreationCompleted)    
                AND TSP.inTenantID = ISNULL(@TenantId,TSP.inTenantID)    
    END TRY    
    BEGIN CATCH       
        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT    
        SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()    
        RAISERROR(@ERRMSG, @ERRSEVERITY, 1)    
   END CATCH    
END 

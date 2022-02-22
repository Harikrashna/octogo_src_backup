  
CREATE PROCEDURE USP_TenantAdminSetupProcessCompleteStatus  
  AS         
  BEGIN        
   BEGIN TRY        
    SET NOCOUNT ON;        
     SELECT TSP.inTenantID [TenantId], inSetupId [SetupId], TSP.btAdminCreationCompleted [IsAdminCreationComplete],  
         TSP.btIsDBSetup [DbSetup] ,TSP.btIsAppURLSetup [AppUrlSetUp],         
            TSP.btIsSetupProcessComplete [SetUpProcess], TSP.btIsWSSetup [WsSetup]        
      FROM TblTrn_TenantSetupProcessLog TSP(NOLOCK)        
      INNER JOIN  TblTrn_TenantDB TB (NOLOCK)        
     ON TB.inTenantID = TSP.inTenantID         
   END TRY        
   BEGIN CATCH           
  DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT        
  SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()        
  RAISERROR(@ERRMSG, @ERRSEVERITY, 1)        
   END CATCH          
  END 
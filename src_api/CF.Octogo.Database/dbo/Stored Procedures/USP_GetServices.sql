/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_GetServices

*/	
CREATE PROCEDURE [dbo].[USP_GetServices]  
(
	@MaxResultCount int,
 	@SkipCount int,
 	@Sorting varchar(50) =null,
 	@filter varchar(50) =null
 )
AS    
    BEGIN    
	DECLARE @Sql VARCHAR(MAX)=''
		IF(ISNULL(@Sorting,'')='')
		BEGIN
			SET @Sorting = 'vcServiceName';
		END
			SET @Sql = @Sql + '
			SELECT inServiceID [ServiceId], vcServiceName [ServiceName]  ,vcDescription [Description]    
            FROM TblMst_Services (NOLOCK) 
            WHERE btIsActive = 1 AND (vcServiceName like ''%'+ISNULL(@filter,'')+'%''or vcDescription like ''%'+ISNULL(@filter,'')+'%'' ) '
			SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
				SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			EXEC(@Sql)

			SELECT COUNT(inServiceID) [totalCount] 
				FROM TblMst_Services(NOLOCK)
				WHERE btIsActive=1 
				AND (vcServiceName like '%'+ISNULL(@filter,'')+'%' OR vcDescription like '%'+ISNULL(@filter,'')+'%' )
		
  
    END
	


	 

	 
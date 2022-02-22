/*
    CREATED ON : 24/11/2021
    CREATE BY : Deepak
    DESC : 
    DRY RUN: 
    USP_GetPerAWBCostApproach 5,0
*/
CREATE PROCEDURE [dbo].[USP_GetPerAWBCostApproach]  
(
@MaxResultCount int,
 @SkipCount int,
 @Sorting varchar(50) =null,
 @Filter varchar(50) =null
 )
AS    
    BEGIN    
	DECLARE @Sql VARCHAR(MAX)=''
		IF(ISNULL(@Sorting,'')='')
		Begin
		    SET @Sorting = 'vcApproachName';
		END
			SET @Sql = @Sql + '
                SELECT inApproachID [Id], vcApproachName [ApproachName]  ,vcDescription [Description]    
                    FROM TblMst_PerAWBCostApproach (NOLOCK) 
                    WHERE btIsActive = 1 AND (vcApproachName like ''%'+ISNULL(@Filter,'')+'%''or vcDescription like ''%'+ISNULL(@Filter,'')+'%'' ) '
			SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
				SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			EXEC(@Sql)

			SELECT COUNT(inApproachID) [totalCount] 
				FROM TblMst_PerAWBCostApproach(NOLOCK)
				WHERE btIsActive=1 
				AND (vcApproachName like '%'+ISNULL(@Filter,'')+'%' or vcDescription like '%'+ISNULL(@Filter,'')+'%' ) 
		
  
    END
	


	 

	 
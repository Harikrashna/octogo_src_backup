
/*
Created by:Merajuddin khan
Created on:05 dec 2021
dry run exec [USP_GetDesignation] @MaxResultCount=10,@SkipCount=0,@Sorting=null,@Filter=null
*/

CREATE PROCEDURE [dbo].[USP_GetDesignation]
    (
      @MaxResultCount int,
      @SkipCount int,
      @Sorting VARCHAR(30),
      @Filter varchar(max)
    )
AS  
    BEGIN        


	BEGIN
      SELECT  inDesignationID [Id] ,vcDesignationName [DesignationName]  ,vcDescription [Description] FROM TblMst_Designation WHERE btIsActive = 1 
	     AND (vcDesignationName LIKE isnull('%'+@Filter+'%', '%%') OR vcDescription LIKE isnull('%'+@Filter+'%','%%') )
	  ORDER BY    
          CASE
             WHEN @Sorting = 'DesignationName ASC' THEN vcDesignationName 
	  	   END
	  	   ASC,
	  	   CASE
             WHEN @Sorting = 'DesignationName DESC' THEN vcDesignationName 
          END
	  	DESC,
	      CASE
	  	    WHEN @Sorting = 'Description ASC' THEN vcDescription 
	  	   END
	  	   ASC,
	  	   CASE
             WHEN @Sorting = 'Description DESC' THEN vcDescription 
	   	   END
	  	   DESC
OFFSET (@skipCount) ROWS FETCH NEXT @maxResultCount ROWS ONLY
SELECT  COUNT(vcDesignationName) [totalCount] FROM TblMst_Designation WHERE btIsActive=1 AND (vcDesignationName LIKE isnull('%'+@Filter+'%', '%%')  OR vcDescription LIKE isnull('%'+@Filter+'%','%%') )

	END

  END
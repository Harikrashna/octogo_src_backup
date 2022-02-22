
CREATE PROCEDURE [dbo].[USP_GetPricingApproach]
    (
      @MaxResultCount int,
      @SkipCount int,
      @Sorting VARCHAR(30),
      @Filter varchar(max)
    )
AS  
    BEGIN        


	BEGIN
      SELECT  inApproachID [Id] ,vcApproachName [ApproachName]  ,vcDescription [Description] FROM TblMst_PricingApproach WHERE btIsActive = 1 
	     AND (vcApproachName LIKE isnull('%'+@Filter+'%', '%%') OR vcDescription LIKE isnull('%'+@Filter+'%','%%') )
	  ORDER BY    
          CASE
             WHEN @Sorting = 'ApproachName ASC' THEN vcApproachName 
	  	   END
	  	   ASC,
	  	   CASE
             WHEN @Sorting = 'ApproachName DESC' THEN vcApproachName 
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
		OFFSET (@skipCount) ROWS 
		FETCH NEXT @maxResultCount ROWS ONLY
		SELECT  COUNT(inApproachID) [totalCount] 
			FROM TblMst_PricingApproach 
			WHERE btIsActive=1 
			AND (vcApproachName LIKE isnull('%'+@Filter+'%', '%%')  OR vcDescription LIKE isnull('%'+@Filter+'%','%%'))

	END

  END
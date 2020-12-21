#!/bin/bash

# PROFILE=civ6_prod
# SOURCE_TABLE=Game
# SOURCE_REGION=us-east-1
# DESTINATION_TABLE=civ6-pbc-production-GameTable-NTK855SECU7F
# DESTINATION_REGION=us-west-2
MAX_ITEMS=25
index=0
DATA=$(aws dynamodb scan --table-name $TABLE --max-items $MAX_ITEMS --region $SOURCE_REGION --profile $PROFILE)
((index+=1))
echo $DATA | cat > "$TABLE-$index.json"

nextToken=$(echo $DATA | jq '.NextToken')
while [[ "${nextToken}" != "" ]]
do
  DATA=$(aws dynamodb scan --table-name $TABLE --max-items $MAX_ITEMS --region $SOURCE_REGION --profile $PROFILE --starting-token $nextToken)
  ((index+=1))
  echo $DATA | cat > "$TABLE-$index.json"
  nextToken=$(echo $DATA | jq '.NextToken')
  echo $nextToken
done

for x in `ls *$TABLE*.json`; do
  echo $x
  cat $x | jq ".Items | {\"$DESTINATION_TABLE\": [{\"PutRequest\": { \"Item\": .[]}}]}" > inserts.jsons
  aws dynamodb batch-write-item --region $DESTINATION_REGION --profile $PROFILE --request-items file://inserts.jsons
done
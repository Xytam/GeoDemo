#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
docker-compose up -d
echo -e "\nWaiting for ksqlDB to start\n"
sleep 30
docker-compose exec -d data-puller bash -c "cd /tmp/KafkaGeoDemo/ && node src/main/js/dataLoader.js"
sleep 15
${DIR}/ksqlDB/run_ksqlDB.sh &> ${DIR}/ksqlDB/runOutput.log
echo -e "\nDone Running ksqlDB Commands for setup\n"
docker-compose exec -d webapp bash -c "cd /tmp/KafkaGeoDemo/ && java -jar jars/KafkaEventService-1.0.0-SNAPSHOT-fat.jar -conf conf/kesConfig.json"


CREATE STREAM GEO_HEAT_MAP_STREAM
      ( WS BIGINT,
        WE BIGINT,
        GEOHASH STRING,
        TOTAL BIGINT)
WITH (KAFKA_TOPIC='GEO_HEAT_MAP', VALUE_FORMAT='JSON');

CREATE STREAM CALIBRATION AS
    SELECT 1 UNITY, *
    FROM GEO_HEAT_MAP_STREAM
    EMIT CHANGES;

SELECT MAX(TOTAL), UNITY
FROM CALIBRATION
GROUP BY UNITY
EMIT CHANGES;
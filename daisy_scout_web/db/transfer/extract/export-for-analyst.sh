export PGPASSWORD=$3
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Match2025Data\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/match.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Leader2025Data\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/leader.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Pit2025Data\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/pit.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Casino2025Data\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/casino.csv
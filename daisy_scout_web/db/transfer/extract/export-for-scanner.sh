export PGPASSWORD=$3
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"PickList2025\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/picklist.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"DoNotPickList2025\" where \"Event_Id\" = '$1$2') TO stdout DELIMITER ',' CSV HEADER" > /transfer-out/dnplist.csv

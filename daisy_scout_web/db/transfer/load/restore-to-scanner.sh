echo $1$2

export PGPASSWORD=$3

psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"PickList2025\" WHERE \"Event_Id\" = '$1$2'"
psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"DoNotPickList2025\" WHERE \"Event_Id\" = '$1$2'"



psql --dbname=neondb --username=neondb_owner -c  "\copy \"PickList2025\" FROM '/transfer-in/picklist.csv' delimiter ',' csv HEADER"
psql --dbname=neondb --username=neondb_owner -c  "\copy \"DoNotPickList2025\" FROM '/transfer-in/dnplist.csv' delimiter ',' csv HEADER"
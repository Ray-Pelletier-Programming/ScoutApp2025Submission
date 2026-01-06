echo $1$2

export PGPASSWORD=$3

psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"Match2025Data\" WHERE \"Event_Id\" = '$1$2'"
psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"Leader2025Data\" WHERE \"Event_Id\" = '$1$2'"
psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"Pit2025Data\" WHERE \"Event_Id\" = '$1$2'"
psql --dbname=neondb --username=neondb_owner -c  "DELETE FROM \"Casino2025Data\" WHERE \"Event_Id\" = '$1$2'"



psql --dbname=neondb --username=neondb_owner -c  "\copy \"Match2025Data\" FROM '/transfer-in/match.csv' delimiter ',' csv HEADER"
psql --dbname=neondb --username=neondb_owner -c  "\copy \"Leader2025Data\" FROM '/transfer-in/leader.csv' delimiter ',' csv HEADER"
psql --dbname=neondb --username=neondb_owner -c  "\copy \"Pit2025Data\" FROM '/transfer-in/pit.csv' delimiter ',' csv HEADER"
psql --dbname=neondb --username=neondb_owner -c  "\copy \"Casino2025Data\" FROM '/transfer-in/casino.csv' delimiter ',' csv HEADER"
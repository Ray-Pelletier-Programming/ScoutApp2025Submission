export PGPASSWORD=$1

psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Match2025Data\" ORDER BY \"Event_Id\", \"Match_Type\", \"Match_Number\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/match.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Leader2025Data\" ORDER BY \"Event_Id\", \"Match_Type\", \"Match_Number\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/leader.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Pit2025Data\" ORDER BY \"Event_Id\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/pit.bkup.csv

psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"PickList2025\" ORDER BY \"Event_Id\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/picklist.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"DoNotPickList2025\" ORDER BY \"Event_Id\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/donotpicklist.bkup.csv

psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Seasons\" ORDER BY \"Season\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/season.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"Events\" ORDER BY \"Event_Id\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/events.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventTeams\" ORDER BY \"Event_Id\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventteams.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventMatches\" ORDER BY \"Event_Match_Id\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventmatches.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventMatchTeams\" ORDER BY \"Event_Match_Id\", \"Team_Number\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventmatchteams.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventMatches2025Result\" ORDER BY \"Event_Match_Id\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventmatchesresult.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventMatches2025TbaResult\" ORDER BY \"Event_Match_Id\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventmatchestbaresult.bkup.csv
psql --dbname=neondb --username=neondb_owner -c "COPY (SELECT * FROM \"EventMatchTeams2025Result\" ORDER BY \"Event_Match_Id\", \"Alliance_Color\", \"Alliance_Position\") TO stdout DELIMITER ',' CSV HEADER" > /transfer-in/eventmatchteamresult.bkup.csv



#apt-get update
#apt-get install dnsutils -y
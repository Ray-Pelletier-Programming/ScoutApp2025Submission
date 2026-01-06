call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\load\match.csv (
    DEL .\daisy_scout_web\db\transfer\load\match.csv
)

IF EXIST .\daisy_scout_web\db\transfer\load\pit.csv (
    DEL .\daisy_scout_web\db\transfer\load\pit.csv
)

IF EXIST .\daisy_scout_web\db\transfer\load\leader.csv (
    DEL .\daisy_scout_web\db\transfer\load\leader.csv
)

IF EXIST .\daisy_scout_web\db\transfer\load\casino.csv (
    DEL .\daisy_scout_web\db\transfer\load\casino.csv
)


copy d:\match.csv .\daisy_scout_web\db\transfer\load
copy d:\pit.csv .\daisy_scout_web\db\transfer\load
copy d:\leader.csv .\daisy_scout_web\db\transfer\load
copy d:\casino.csv .\daisy_scout_web\db\transfer\load

docker exec -it team341-2025-scouting-pg-db bash /transfer-in/restore-to-analyst.sh %Season% %Event% %POSTGRES_PASSWORD%

pause
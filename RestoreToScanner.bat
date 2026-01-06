call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\load\picklist.csv (
    DEL .\daisy_scout_web\db\transfer\load\picklist.csv
)

IF EXIST .\daisy_scout_web\db\transfer\load\dnplist.csv (
    DEL .\daisy_scout_web\db\transfer\load\dnplist.csv
)

copy d:\picklist.csv .\daisy_scout_web\db\transfer\load
copy d:\dnplist.csv .\daisy_scout_web\db\transfer\load

docker exec -it team341-2025-scouting-pg-db bash /transfer-in/restore-to-scanner.sh %Season% %Event% %POSTGRES_PASSWORD%

pause
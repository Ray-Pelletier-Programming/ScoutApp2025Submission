call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\extract\picklist.csv (
    DEL .\daisy_scout_web\db\transfer\extract\picklist.csv
)

IF EXIST .\daisy_scout_web\db\transfer\extract\dnplist.csv (
    DEL .\daisy_scout_web\db\transfer\extract\dnplist.csv
)

docker exec -it team341-2025-scouting-pg-db bash /transfer-out/export-for-scanner.sh %Season% %Event% %POSTGRES_PASSWORD%

copy .\daisy_scout_web\db\transfer\extract\picklist.csv d:\
copy .\daisy_scout_web\db\transfer\extract\dnplist.csv d:\

pause 
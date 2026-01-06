call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\extract\leader.share.csv (
    DEL .\daisy_scout_web\db\transfer\extract\leader.share.csv
)


docker exec -it team341-2025-scouting-pg-db bash /transfer-out/export-for-share-leader.sh %Season% %Event% %POSTGRES_PASSWORD%

copy .\daisy_scout_web\db\transfer\extract\leader.share.csv d:\
pause 
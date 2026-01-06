call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\extract\match.share.csv (
    DEL .\daisy_scout_web\db\transfer\extract\match.share.csv
)

docker exec -it team341-2025-scouting-pg-db bash /transfer-out/export-for-share-match.sh %Season% %Event% %POSTGRES_PASSWORD%

copy .\daisy_scout_web\db\transfer\extract\match.share.csv d:\
pause 
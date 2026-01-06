call CurEvent.bat

IF EXIST .\daisy_scout_web\db\transfer\extract\match.csv (
    DEL .\daisy_scout_web\db\transfer\extract\match.csv
)

IF EXIST .\daisy_scout_web\db\transfer\extract\pit.csv (
    DEL .\daisy_scout_web\db\transfer\extract\pit.csv
)

IF EXIST .\daisy_scout_web\db\transfer\extract\leader.csv (
    DEL .\daisy_scout_web\db\transfer\extract\leader.csv
)

IF EXIST .\daisy_scout_web\db\transfer\extract\casino.csv (
    DEL .\daisy_scout_web\db\transfer\extract\casino.csv
)


docker exec -it team341-2025-scouting-pg-db bash /transfer-out/export-for-analyst.sh %Season% %Event% %POSTGRES_PASSWORD%

copy .\daisy_scout_web\db\transfer\extract\match.csv d:\
copy .\daisy_scout_web\db\transfer\extract\pit.csv d:\
copy .\daisy_scout_web\db\transfer\extract\leader.csv d:\
copy .\daisy_scout_web\db\transfer\extract\casino.csv d:\
pause 
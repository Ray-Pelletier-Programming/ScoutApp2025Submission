
IF EXIST .\daisy_scout_web\db\transfer\cloud\match.csv (
    DEL .\daisy_scout_web\db\transfer\cloud\match.csv
)

IF EXIST .\daisy_scout_web\db\transfer\cloud\pit.csv (
    DEL .\daisy_scout_web\db\transfer\cloud\pit.csv
)

IF EXIST .\daisy_scout_web\db\transfer\cloud\leader.csv (
    DEL .\daisy_scout_web\db\transfer\cloud\leader.csv
)

IF EXIST .\daisy_scout_web\db\transfer\cloud\casino.csv (
    DEL .\daisy_scout_web\db\transfer\cloud\casino.csv
)


copy d:\match.csv .\daisy_scout_web\db\transfer\cloud
copy d:\pit.csv .\daisy_scout_web\db\transfer\cloud
copy d:\leader.csv .\daisy_scout_web\db\transfer\cloud
REM copy d:\casino.csv .\daisy_scout_web\db\transfer\cloud
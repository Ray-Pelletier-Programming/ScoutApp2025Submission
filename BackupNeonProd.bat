call CurEvent.bat

docker run --network=host --interactive -v %cd%/daisy_scout_web/db/transfer/cloud:/transfer-in daisy-neon-cloud-psql:1.0.0 bash /transfer-in/backup-db.sh %POSTGRES_PASSWORD% %POSTGRES_HOST_PROD%
pause 


REM Had to enable host networking in Docker Desktop settings
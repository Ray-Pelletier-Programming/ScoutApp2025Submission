call CurEvent.bat

call CopyDatafilesForCloud.bat

docker run --network=host --interactive -v %cd%/daisy_scout_web/db/transfer/cloud:/transfer-in daisy-neon-cloud-psql:1.0.0 bash /transfer-in/restore-to-cloud.sh %Season% %Event% %POSTGRES_PASSWORD% %POSTGRES_HOST%
pause 


REM Had to enable host networking in Docker Desktop settings
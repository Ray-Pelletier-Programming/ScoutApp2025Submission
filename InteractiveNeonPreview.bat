call CurEvent.bat

docker run --network=host -it -v %cd%/daisy_scout_web/db/transfer/cloud:/transfer-in daisy-neon-cloud-psql:1.0.0 bash
pause 


REM Had to enable host networking in Docker Desktop settings
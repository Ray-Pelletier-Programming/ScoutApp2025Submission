call CurEvent.bat

docker exec -it team341-2025-scouting-pg-db bash /transfer-out/backup-db.sh %POSTGRES_PASSWORD% %NEON_PROXY_HOST%
pause 


REM Had to enable host networking in Docker Desktop settings
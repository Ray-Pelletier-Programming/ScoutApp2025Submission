set "workdir=%cd%"
REM %~dp0 is the path to this file with a trailing space...
CD %~dp0
CALL .\StopAll.bat
docker rmi daisyscout2025-team341-2025-scouting-api
docker compose --profile Web build
CD %var%
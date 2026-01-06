set "workdir=%cd%"
REM %~dp0 is the path to this file with a trailing space...
CD %~dp0
CALL .\StopAll.bat
docker rmi daisyscout2025-team341-2025-scouting-tablet
docker builder prune
docker compose --profile Scanner build
CD %var%
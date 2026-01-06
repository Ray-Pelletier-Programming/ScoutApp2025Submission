set "workdir=%cd%"
set CLOUD_PREVIEW=true
docker compose --profile Scanner up -d
REM %~dp0 is the path to this file with a trailing space...
CD %~dp0daisy_scout_web
pnpm run dev
CD %var%
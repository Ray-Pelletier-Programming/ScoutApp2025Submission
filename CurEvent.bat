FOR /F "tokens=*" %%i in ('type .\daisy_scout_web\.env') do SET %%i 2> NUL:
REM FOR /F "tokens=* eol=#" %%i in ('.\daisy_scout_web\.env') do SET %%i

SET Season=2025
SET Event=PAAMB
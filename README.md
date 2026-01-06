# DaisyScout2025

copy the .env into daisy_scout_web from the Google Drive.

Node requires 22.13.1; if not installed run `nvm install 22.13.1` and `nvm use 22.13.1`

If an error is returned about pnpm, run the command `npm install -g pnpm`

restart the terminal afterwards

cd daisy_scout_web
pnpm i

then go back to parent folder for batchfiles

To run app without internet:

- run notepad as administrator
- \windows\system32\drivers\etc\hosts
- Put following line at end of file
  `127.0.0.1 db.localtest.me`

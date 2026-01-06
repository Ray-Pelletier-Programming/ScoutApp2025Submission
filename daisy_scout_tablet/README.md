# daisy_scout_tablet

A new Flutter project.

## Getting Started

This project is a starting point for Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

If getting a compiler error about StringListObjectInputStream
`flutter clean`
`flutter pub cache clean`
`flutter pub get`

# Daisy commands

`fvm flutter build web --no-tree-shake-icons --release --no-web-resources-cdn` Builds for release mode and does not tree-shake icon files (need to fix bug before the can be tree-shaken)

`fvm flutter run -d chrome --release --no-web-resources-cdn` Runs project in release for

Install globally: https://vercel.com/docs/cli
Vercel Project Settings: https://blog.leszekkrol.com/how-to-deploy-a-flutter-web-app-to-vercel-887b28c93478
Deploying to Vercel: https://www.alexchantastic.com/deploying-with-vercel-cli

npm install -D vercel
npx vercel -v
npx vercel login
npx vercel

npx vercel deploy

npx vercel deploy --prod

npx vercel build
npx vercel deploy --prebuilt

npx vercel build --prod
npx vercel deploy --prebuilt --prod

FROM daisy-flutter-base:3.27.2 AS builder
WORKDIR /project

ENV USER="developer"
USER $USER
COPY ./daisy_scout_tablet /project/
RUN sudo chmod -R 777 /project/

RUN flutter pub get

RUN flutter build web --no-tree-shake-icons --release --no-web-resources-cdn



FROM nginx:alpine AS final

COPY --from=builder /project/build/web /usr/share/nginx/html
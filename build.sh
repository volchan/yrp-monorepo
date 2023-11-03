#!/bin/sh

while [[ "$#" -gt 0 ]]; do
  case $1 in
  -a | --app)
    APP="$2"
    shift
    ;;
  -i | --image)
    IMAGE="$2"
    shift
    ;;
  -t | --tag)
    TAG="$2"
    shift
    ;;
  -p | --push)
    PUSH=true
    ;;
  esac
  shift
done

echo "🛠️  Building Docker image with tag $IMAGE:$TAG for app $APP"

docker build -f apps/$APP/Dockerfile -t $IMAGE:$TAG --build-arg NODE_ENV=production --build-arg DATABASE_URL=postgres://postgres:postgres@localhost:5432/yrp_development .

if [ "$PUSH" = true ]; then
  echo "⬆️  Pushing image to registry"
  docker push $IMAGE:$TAG
  echo "Tagging image as latest"
  docker tag $IMAGE:$TAG $IMAGE:latest
else
  echo "❌  Not pushing image to registry"
fi

unset APP
unset IMAGE
unset TAG
unset PUSH

echo "✅  Done"

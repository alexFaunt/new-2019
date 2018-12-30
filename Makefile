.PHONY: up down docker-build migrate populate docker-clean-images docker-clean-volumes docker-nuke

## Setup the development environment
init:
	npm ci
	make reboot

## Restart everything - generally useful when adding dependencies
reboot: build up

## prefer reboot, but this is the build steps required to be able to `make up`
build: down docker-clean-images docker-build migrate populate

## Run the service and watch for changes
up:
	docker-compose up

## Shut down the service and any associated volume
down:
	docker-compose down --volumes

## Builds the docker container using the docker args file
docker-build:
	docker-compose build app

## might need a pause - or might need to change the dependency?
## Migrate the development database
migrate:
	docker-compose up -d postgres-db
	docker-compose run --rm app npm run migrate

## Populate the development database
populate:
	docker-compose up -d postgres-db
	docker-compose run --rm app npm run populate

docker-clean-images:
	docker image prune --force --filter "until=24h"

docker-clean-volumes:
	docker volume prune --force

docker-nuke:
	docker system prune --force --all

## Display this help text
help:
	@echo "AVAILABLE TARGETS:"
	@awk '/^[a-zA-Z\-\_0-9%]+:/ {                    \
	  nb = sub( /^## /, "", helpMsg );              \
	  if(nb == 0) {                                 \
	    helpMsg = $$0;                              \
	    nb = sub( /^[^:]*:.* ## /, "", helpMsg );   \
	  }                                             \
	  if (nb)                                       \
	    print  $$1 "\t" helpMsg;                    \
	}                                               \
	{ helpMsg = $$0 }'                              \
	$(MAKEFILE_LIST) | column -ts $$'\t' |          \
	grep --color '^[^ ]*'

.DEFAULT_GOAL := help

.PHONY: help
help: ## show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

clean:
	@rm -f *.log
	@rm -rf build

clean-hard: clean
	@rm -rf node_modules

install:
	@ni

lint:
	@nr lint --fix

run:
	@rm -rf build/
	@rm -f backup*.log
	@ts-node src/index.ts
#	@node --experimental-specifier-resolution=node --loader ts-node/esm src/index.ts

.PHONY: build
build:
	@nr build

run-js: build
	@node build/index.js

test:
	@nr --silent test
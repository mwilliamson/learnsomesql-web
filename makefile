.PHONY: build

HTML = $(wildcard browser/*/*.html)
TEMPLATES = $(HTML:.html=.js)
COMPONENT_BIN = node_modules/.bin/component

build: node_modules/.bin/component components
	$(COMPONENT_BIN) build -o _build -n learnsomesql

node_modules/.bin/component: package.json
	npm install

components: component.json
	$(COMPONENT_BIN) install


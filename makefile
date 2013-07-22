HTML = $(wildcard browser/*/*.html)
TEMPLATES = $(HTML:.html=.js)
COMPONENT_BIN = node_modules/.bin/component


build: components
	$(COMPONENT_BIN) build -o _build -n learnsomesql

components: component.json
	$(COMPONENT_BIN) install

%.js: %.html
	$(COMPONENT_BIN) convert $<

install: 
	npm install 

gendiff:
	npx babel-node -- src/bin/gendiff.js --format plain __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

publish:
	npm publish

lint:
	npx eslint .

test:
	npm test -- --coverage

watch:
	npm test -- --watchAll

.PHONY: test install
	

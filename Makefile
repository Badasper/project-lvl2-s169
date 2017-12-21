install: 
	npm install 

gendiff:
	npm run babel-node -- src/bin/gendiff.js -V
	npm run babel-node -- src/bin/gendiff.js -h
	npm run babel-node -- src/bin/gendiff.js __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test -- --coverage

watch:
	npm test -- --watchAll

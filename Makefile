install: 
	npm install 

gendiff:
	npm run babel-node -- src/bin/gendiff.js src/__tests__/before.json src/__tests__/after.json

publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test -- --watchAll

install: 
	npm install 

gendiff:
	npm run babel-node -- src/bin/gendiff.js -h
	npm run babel-node -- src/bin/gendiff.js file1 file2

publish:
	npm publish

lint:
	npm run eslint .

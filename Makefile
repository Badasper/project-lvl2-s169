install: 
	npm install 

task:
	npm run babel-node -- src/bin/task.js

publish:
	npm publish

lint:
	npm run eslint .

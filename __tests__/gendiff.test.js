import {
  // readConfigFile,
  // isNewProperty,
  // isEqualProperty,
  // isMofifiedProperty,
  // isDeletedProperty,
  makeDiff } from '../src';

// const pathToFile = '__tests__/__fixtures__/testRead.json';
// test('read data from json file to obj', () => {
//   expect(readConfigFile(pathToFile)).toEqual({ test: 'test' });
// });

// test('find new properties', () => {
//   expect(isNewProperty({ before: 'before' }, { after: 'after' }, 'after')).toBe(true);
// });

// test('find changed properties', () => {
//   expect(isMofifiedProperty({ prop: 'before' }, { prop: 'after' }, 'prop')).toBe(true);
// });

// test('find equal properties', () => {
//   expect(isEqualProperty({ prop: 'before' }, { prop: 'before' }, 'prop')).toBe(true);
// });

// test('find deleted properties', () => {
//   expect(isDeletedProperty({ prop1: 'before1', prop2: 'before2' }, { prop1: 'before1' }, 'prop2')).toBe(true);
// });

const answer1 = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;
const pathBefore = '__tests__/__fixtures__/before.json';
const pathAfter = '__tests__/__fixtures__/after.json';

test('find difference in file', () => {
  expect(makeDiff(pathBefore, pathAfter)).toBe(answer1);
});

const answer2 = '{\n}';
const pathEmtyFile = '__tests__/__fixtures__/empty.json';
test('find difference in emtys file', () => {
  expect(makeDiff(pathEmtyFile, pathEmtyFile)).toBe(answer2);
});

const answer3 = `{
    host: hexlet.io
    timeout: 50
    proxy: 123.234.53.22
}`;
test('find difference in the same file', () => {
  expect(makeDiff(pathBefore, pathBefore)).toBe(answer3);
});

const answer4 = `{
  - host: hexlet.io
  - timeout: 50
  - proxy: 123.234.53.22
}`;
test('find difference in the file and emptyFile', () => {
  expect(makeDiff(pathBefore, pathEmtyFile)).toBe(answer4);
});

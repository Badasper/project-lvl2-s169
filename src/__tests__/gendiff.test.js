import { readConfigFile,
  getNewProperty,
  getEqualProperty,
  getMofifiedProperty,
  getDeletedProperty,
  makeDiff } from '..';

const pathToFile = `${__dirname}/testRead.json`;
test('read data from json file to obj', () => {
  expect(readConfigFile(pathToFile)).toEqual({ test: 'test' });
});

test('find new properties', () => {
  expect(getNewProperty({ before: 'before' }, { after: 'after' })).toBe('+ after: after\n');
});

test('find changed properties', () => {
  expect(getMofifiedProperty({ prop: 'before' }, { prop: 'after' })).toBe('+ prop: after\n- prop: before\n');
});

test('find equal properties', () => {
  expect(getEqualProperty({ prop: 'before' }, { prop: 'before' })).toBe('  prop: before\n');
});

test('find deleted properties', () => {
  expect(getDeletedProperty({ prop1: 'before1', prop2: 'before2' }, { prop1: 'before1' })).toBe('- prop2: before2\n');
});

const answer = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
}`;
const pathBefore = 'src/__tests__/before.json';
const pathAfter = 'src/__tests__/after.json';

test('find difference in file', () => {
  expect(makeDiff(pathBefore, pathAfter)).toBe(answer);
});

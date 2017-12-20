import { makeDiff } from '../src';

const pathBefore = '__tests__/__fixtures__/before.json';
const pathAfter = '__tests__/__fixtures__/after.json';
const pathEmptyFile = '__tests__/__fixtures__/empty.json';

const answer1 = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;
test('find difference in files', () => {
  expect(makeDiff(pathBefore, pathAfter)).toBe(answer1);
});

const answer2 = '{\n}';
test('find difference in emties files', () => {
  expect(makeDiff(pathEmptyFile, pathEmptyFile)).toBe(answer2);
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
  expect(makeDiff(pathBefore, pathEmptyFile)).toBe(answer4);
});

const answer5 = `{
  + timeout: 20
  + verbose: true
  + host: hexlet.io
}`;
test('find difference in the emptyFile and file', () => {
  expect(makeDiff(pathEmptyFile, pathAfter)).toBe(answer5);
});

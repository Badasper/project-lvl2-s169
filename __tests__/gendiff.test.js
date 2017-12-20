import { makeDiff } from '../src';

const pathBeforeJson = '__tests__/__fixtures__/before.json';
const pathAfterJson = '__tests__/__fixtures__/after.json';
const pathEmptyFileJson = '__tests__/__fixtures__/empty.json';

const pathBeforeYaml = '__tests__/__fixtures__/before.yaml';
const pathAfterYaml = '__tests__/__fixtures__/after.yaml';
const pathEmptyFileYaml = '__tests__/__fixtures__/empty.yaml';

const expectedTowFiles = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;
const expectedEmptyFiles = '{\n}';
const expectedSameFiles = `{
    host: hexlet.io
    timeout: 50
    proxy: 123.234.53.22
}`;
const expectedFileEmptyFile = `{
  - host: hexlet.io
  - timeout: 50
  - proxy: 123.234.53.22
}`;
const expectedEmtyFileFile = `{
  + timeout: 20
  + verbose: true
  + host: hexlet.io
}`;
describe('test JSON file', () => {
  test('find difference in files JSON', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson)).toBe(expectedTowFiles);
  });
  test('find difference in empties files JSON', () => {
    expect(makeDiff(pathEmptyFileJson, pathEmptyFileJson)).toBe(expectedEmptyFiles);
  });
  test('find difference in the same file JSON', () => {
    expect(makeDiff(pathBeforeJson, pathBeforeJson)).toBe(expectedSameFiles);
  });
  test('find difference in the file and emptyFile JSON', () => {
    expect(makeDiff(pathBeforeJson, pathEmptyFileJson)).toBe(expectedFileEmptyFile);
  });
  test('find difference in the emptyFile and file JSON', () => {
    expect(makeDiff(pathEmptyFileJson, pathAfterJson)).toBe(expectedEmtyFileFile);
  });
});

describe('test YAML file', () => {
  test('find difference in files YAML', () => {
    expect(makeDiff(pathBeforeYaml, pathAfterYaml)).toBe(expectedTowFiles);
  });
  test('find difference in empties files YAML', () => {
    expect(makeDiff(pathEmptyFileYaml, pathEmptyFileYaml)).toBe(expectedEmptyFiles);
  });
  test('find difference in the same file YAML', () => {
    expect(makeDiff(pathBeforeYaml, pathBeforeYaml)).toBe(expectedSameFiles);
  });
  test('find difference in the file and emptyFile YAML', () => {
    expect(makeDiff(pathBeforeYaml, pathEmptyFileYaml)).toBe(expectedFileEmptyFile);
  });
  test('find difference in the emptyFile and file YAML', () => {
    expect(makeDiff(pathEmptyFileYaml, pathAfterYaml)).toBe(expectedEmtyFileFile);
  });
});

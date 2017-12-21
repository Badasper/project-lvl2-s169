import { makeDiff } from '../src';

const pathBefore = '__tests__/__fixtures__/before';
const pathAfter = '__tests__/__fixtures__/after';
const pathEmptyFile = '__tests__/__fixtures__/empty';

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
  const pathBeforeJson = `${pathBefore}.json`;
  const pathAfterJson = `${pathAfter}.json`;
  const pathEmptyFileJson = `${pathEmptyFile}.json`;
  test('find difference in files', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson)).toBe(expectedTowFiles);
  });
  test('find difference in empties files', () => {
    expect(makeDiff(pathEmptyFileJson, pathEmptyFileJson)).toBe(expectedEmptyFiles);
  });
  test('find difference in the same file', () => {
    expect(makeDiff(pathBeforeJson, pathBeforeJson)).toBe(expectedSameFiles);
  });
  test('find difference in the file and emptyFile', () => {
    expect(makeDiff(pathBeforeJson, pathEmptyFileJson)).toBe(expectedFileEmptyFile);
  });
  test('find difference in the emptyFile and file', () => {
    expect(makeDiff(pathEmptyFileJson, pathAfterJson)).toBe(expectedEmtyFileFile);
  });
});

describe('test YAML file', () => {
  const pathBeforeYaml = `${pathBefore}.yaml`;
  const pathAfterYaml = `${pathAfter}.yaml`;
  const pathEmptyFileYaml = `${pathEmptyFile}.yaml`;
  test('find difference in files', () => {
    expect(makeDiff(pathBeforeYaml, pathAfterYaml)).toBe(expectedTowFiles);
  });
  test('find difference in empties files', () => {
    expect(makeDiff(pathEmptyFileYaml, pathEmptyFileYaml)).toBe(expectedEmptyFiles);
  });
  test('find difference in the same file', () => {
    expect(makeDiff(pathBeforeYaml, pathBeforeYaml)).toBe(expectedSameFiles);
  });
  test('find difference in the file and emptyFile', () => {
    expect(makeDiff(pathBeforeYaml, pathEmptyFileYaml)).toBe(expectedFileEmptyFile);
  });
  test('find difference in the emptyFile and file', () => {
    expect(makeDiff(pathEmptyFileYaml, pathAfterYaml)).toBe(expectedEmtyFileFile);
  });
});

describe('test INI file', () => {
  const pathBeforeIni = `${pathBefore}.ini`;
  const pathAfterIni = `${pathAfter}.ini`;
  const pathEmptyFileIni = `${pathEmptyFile}.ini`;
  test('find difference in files', () => {
    expect(makeDiff(pathBeforeIni, pathAfterIni)).toBe(expectedTowFiles);
  });
  test('find difference in empties files', () => {
    expect(makeDiff(pathEmptyFileIni, pathEmptyFileIni)).toBe(expectedEmptyFiles);
  });
  test('find difference in the same file', () => {
    expect(makeDiff(pathBeforeIni, pathBeforeIni)).toBe(expectedSameFiles);
  });
  test('find difference in the file and emptyFile', () => {
    expect(makeDiff(pathBeforeIni, pathEmptyFileIni)).toBe(expectedFileEmptyFile);
  });
  test('find difference in the emptyFile and file', () => {
    expect(makeDiff(pathEmptyFileIni, pathAfterIni)).toBe(expectedEmtyFileFile);
  });
});

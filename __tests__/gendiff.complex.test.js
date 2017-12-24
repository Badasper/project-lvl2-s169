import makeDiff from '../src';

const pathBefore = '__tests__/__fixtures__/beforeComplex';
const pathAfter = '__tests__/__fixtures__/afterComplex';

const expectedTowFiles = `{
    common: {
        setting1: Value 1
      - setting2: 200
        setting3: true
      - setting6: {
            key: value
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

describe('test JSON file', () => {
  const pathBeforeJson = `${pathBefore}.json`;
  const pathAfterJson = `${pathAfter}.json`;
  test('find difference in complex files', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson)).toBe(expectedTowFiles);
  });
});

describe('test INI file', () => {
  const pathBeforeJson = `${pathBefore}.ini`;
  const pathAfterJson = `${pathAfter}.ini`;
  test('find difference in complex files', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson)).toBe(expectedTowFiles);
  });
});

describe('test YAML file', () => {
  const pathBeforeJson = `${pathBefore}.yaml`;
  const pathAfterJson = `${pathAfter}.yaml`;
  test('find difference in complex files', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson)).toBe(expectedTowFiles);
  });
});

const ecpectFlat = `Property 'timeout' was updated. From '50' to '20'
Property 'proxy' was removed
Property 'common.setting4' was removed
Property 'common.setting5' was removed
Property 'common.sites.base' was added with value: hexlet.io
Property 'common.setting2' was added with value: 200
Property 'common.setting6' was added with complex value
Property 'group1.baz' was updated. From 'bars' to 'bas'
Property 'group3' was removed
Property 'verbose' was added with value: true
Property 'group2' was added with complex value`;

describe('test JSON file, flat output', () => {
  const pathBeforeJson = `${pathBefore}Flat.json`;
  const pathAfterJson = `${pathAfter}Flat.json`;
  test('find difference in complex files', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson, 'plain')).toBe(ecpectFlat);
  });
});

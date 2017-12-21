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

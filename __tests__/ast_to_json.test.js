import makeDiff from '../src';

const pathBefore = '__tests__/__fixtures__/beforeComplex';
const pathAfter = '__tests__/__fixtures__/afterComplex';

const expectedTowFiles = `[
    {
        "property": "common",
        "type": "nested",
        "children": [
            {
                "property": "setting1",
                "type": "equal",
                "valueBefore": "Value 1"
            },
            {
                "property": "setting2",
                "type": "deleted",
                "valueBefore": "200"
            },
            {
                "property": "setting3",
                "type": "equal",
                "valueBefore": true
            },
            {
                "property": "setting6",
                "type": "deleted",
                "valueBefore": {
                    "key": "value"
                }
            },
            {
                "property": "setting4",
                "type": "added",
                "valueAfter": "blah blah"
            },
            {
                "property": "setting5",
                "type": "added",
                "valueAfter": {
                    "key5": "value5"
                }
            }
        ]
    },
    {
        "property": "group1",
        "type": "nested",
        "children": [
            {
                "property": "baz",
                "type": "modified",
                "valueBefore": "bas",
                "valueAfter": "bars"
            },
            {
                "property": "foo",
                "type": "equal",
                "valueBefore": "bar"
            }
        ]
    },
    {
        "property": "group2",
        "type": "deleted",
        "valueBefore": {
            "abc": "12345"
        }
    },
    {
        "property": "group3",
        "type": "added",
        "valueAfter": {
            "fee": "100500"
        }
    }
]`;

describe('test JSON format', () => {
  const pathBeforeJson = `${pathBefore}.json`;
  const pathAfterJson = `${pathAfter}.json`;
  test('json format output', () => {
    expect(makeDiff(pathBeforeJson, pathAfterJson, 'json')).toBe(expectedTowFiles);
  });
});

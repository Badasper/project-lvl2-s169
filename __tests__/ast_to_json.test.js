import makeDiff from '../src';

const pathBefore = '__tests__/__fixtures__/beforeComplex';
const pathAfter = '__tests__/__fixtures__/afterComplex';

const expectedTowFiles = `[
    {
        "property": "common",
        "type": "complexModified",
        "children": [
            {
                "property": "setting1",
                "type": "equal",
                "configBefore": "Value 1"
            },
            {
                "property": "setting2",
                "type": "deleted",
                "configBefore": "200"
            },
            {
                "property": "setting3",
                "type": "equal",
                "configBefore": true
            },
            {
                "property": "setting6",
                "type": "deleted",
                "configBefore": {
                    "key": "value"
                }
            },
            {
                "property": "setting4",
                "type": "new",
                "configAfter": "blah blah"
            },
            {
                "property": "setting5",
                "type": "new",
                "configAfter": {
                    "key5": "value5"
                }
            }
        ]
    },
    {
        "property": "group1",
        "type": "complexModified",
        "children": [
            {
                "property": "baz",
                "type": "modified",
                "configBefore": "bas",
                "configAfter": "bars"
            },
            {
                "property": "foo",
                "type": "equal",
                "configBefore": "bar"
            }
        ]
    },
    {
        "property": "group2",
        "type": "deleted",
        "configBefore": {
            "abc": "12345"
        }
    },
    {
        "property": "group3",
        "type": "new",
        "configAfter": {
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

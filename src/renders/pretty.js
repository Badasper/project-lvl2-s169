import _ from 'lodash';

const intend = '  ';
const eol = '\n';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) => `${intend.repeat(level)}${sign} ${property}: ${value}`;

const flatten = list => list.reduce((acc, elem) => {
  const falatElement = Array.isArray(elem) ? [...acc, ...flatten(elem)] : [...acc, elem];
  return falatElement;
}, []);


const toString = (obj, level) => {
  if (_.isObject(obj)) {
    const objStr = Object.keys(obj).map(element => `${makeRow(element, toString(obj[element], level + 1).join(eol), ' ', level + 2)}`);
    return flatten([startBlock, ...objStr, `${intend.repeat(level + 1)}${endBlock}`]);
  }
  return [obj];
};

const astToString = (ast, level = 1) => {
  const typeMapping = {
    added: element => makeRow(element.property, toString(element.valueAfter, level).join(eol), '+', level),
    deleted: element => makeRow(element.property, toString(element.valueBefore, level).join(eol), '-', level),
    equal: element => makeRow(element.property, toString(element.valueBefore, level).join(eol), ' ', level),
    nested: element => makeRow(element.property, astToString(element.children, level + 2).join(eol), ' ', level),
    modified: element => `${makeRow(element.property, toString(element.valueAfter, level).join(eol), '+', level)
    }${eol}${makeRow(element.property, toString(element.valueBefore, level).join(eol), '-', level)}`,
  };
  const outString = ast.map(element => typeMapping[element.type](element, level));
  return flatten([startBlock, ...outString, `${intend.repeat(level - 1)}${endBlock}`]);
};

export default ast => astToString(ast).join(eol);

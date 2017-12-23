import _ from 'lodash';

const intend = '  ';
const eol = '\n';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) => `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;

const toString = (obj, level) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  const properties = Object.keys(obj);
  const outRow = properties.reduce((acc, element) => {
    const row = makeRow(element, toString(obj[element], level + 1), ' ', level + 2);
    return `${acc}${row}`;
  }, '');
  return `${startBlock}${eol}${outRow}${intend.repeat(level + 1)}${endBlock}`;
};

const typeMapping = {
  added: (element, level) => makeRow(element.property, toString(element.valueAfter, level), '+', level),
  deleted: (element, level) => makeRow(element.property, toString(element.valueBefore, level), '-', level),
  equal: (element, level) => makeRow(element.property, toString(element.valueBefore, level), ' ', level),
  nested: (element, level, value) => makeRow(element.property, value, ' ', level),
  modified: (element, level) => {
    const rowAfter = makeRow(element.property, toString(element.valueAfter, level), '+', level);
    const rowBefore = makeRow(element.property, toString(element.valueBefore, level), '-', level);
    return `${rowAfter}${rowBefore}`;
  },
};

const astToString = (ast, level = 1) => {
  const outString = ast.reduce((acc, element) => {
    const value = element.children ? astToString(element.children, level + 2) : '';
    const astRow = typeMapping[element.type](element, level, value);
    return `${acc}${astRow}`;
  }, '');
  return `${startBlock}${eol}${outString}${intend.repeat(level - 1)}${endBlock}`;
};

export default ast => astToString(ast);

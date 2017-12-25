import _ from 'lodash';

const intend = '  ';
const eol = '\n';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) => `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;

const toString = (obj, level) => {
  if (_.isObject(obj)) {
    const objStr = Object.keys(obj).map(element => `${makeRow(element, toString(obj[element], level + 1), ' ', level + 2)}`);
    return `${startBlock}${eol}${objStr.join('')}${intend.repeat(level + 1)}${endBlock}`;
  }
  return obj;
};

const astToString = (ast, level = 1) => {
  const typeMapping = {
    added: element => makeRow(element.property, toString(element.valueAfter, level), '+', level),
    deleted: element => makeRow(element.property, toString(element.valueBefore, level), '-', level),
    equal: element => makeRow(element.property, toString(element.valueBefore, level), ' ', level),
    nested: element => makeRow(element.property, astToString(element.children, level + 2), ' ', level),
    modified: element => `${makeRow(element.property, toString(element.valueAfter, level), '+', level)
    }${makeRow(element.property, toString(element.valueBefore, level), '-', level)}`,
  };
  const outString = ast.map(element => typeMapping[element.type](element, level)).join('');
  return `${startBlock}${eol}${outString}${intend.repeat(level - 1)}${endBlock}`;
};

export default ast => astToString(ast);

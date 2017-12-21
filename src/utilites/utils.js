import _ from 'lodash';

const eol = '\n';
const intend = '  ';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) =>
  `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;

const prefix = {
  new: '+',
  deleted: '-',
  modified: ['-', '+'],
  complexModified: ' ',
  equal: ' ',
};

const elementToString = (obj, level) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  const properties = Object.keys(obj);
  const out = properties.reduce((acc, element) => {
    const row = makeRow(element, elementToString(obj[element], level + 1), ' ', level + 2);
    return `${acc}${row}`;
  }, '');
  return `${startBlock}${eol}${out}${intend.repeat(level + 1)}${endBlock}`;
};

const astToString = (ast) => {
  const iter = (localAst, level) => {
    const out = localAst.reduce((acc, element) => {
      const sign = prefix[element.status];
      if (element.status === 'complexModified') {
        const astRow = makeRow(element.property, iter(element.astDiff, level + 2), sign, level);
        return `${acc}${astRow}`;
      }
      if (element.status === 'modified') {
        const signBefore = sign[0];
        const signAfter = sign[1];
        const valueAfter = elementToString(element.after, level);
        const valueBefore = elementToString(element.before, level);
        const rowAfter = makeRow(element.property, valueAfter, signAfter, level);
        const rowBefore = makeRow(element.property, valueBefore, signBefore, level);
        return `${acc}${rowAfter}${rowBefore}`;
      }
      const value = element.before ? element.before : element.after;
      return `${acc}${makeRow(element.property, elementToString(value, level), sign, level)}`;
    }, '');
    return `${startBlock}${eol}${out}${intend.repeat(level - 1)}${endBlock}`;
  };
  return iter(ast, 1);
};

export default astToString;

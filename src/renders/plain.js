import _ from 'lodash';

const eol = '\n';
const splitter = '.';

const typeMapping = {
  added: (element, parent) => {
    if (_.isObject(element.valueAfter)) {
      return `Property '${parent}${element.property}' was added with complex value`;
    }
    if (typeof element.valueAfter === 'string') {
      return `Property '${parent}${element.property}' was added with '${element.valueAfter}'`;
    }
    return `Property '${parent}${element.property}' was added with value: ${element.valueAfter}`;
  },
  deleted: (element, parent) => `Property '${parent}${element.property}' was removed`,
  equal: () => '',
  nested: (element, parent) => parent,
  modified: (element, parent) =>
    `Property '${parent}${element.property}' was updated. From '${element.valueBefore}' to '${element.valueAfter}'`,
};

const astToString = (ast, parents = '') => ast.map((element) => {
  const parent = element.children ? astToString(element.children, `${parents}${element.property}${splitter}`) : parents;
  return typeMapping[element.type](element, parent);
}).filter(element => element).join(eol);

export default ast => astToString(ast);

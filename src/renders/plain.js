import _ from 'lodash';

const eol = '\n';
const splitter = '.';

const typeMapping = {
  added: (element, parent) => {
    const value = _.isObject(element.valueAfter) ? 'complex value' : `value: ${element.valueAfter}`;
    return `Property '${parent}${element.property}' was added with ${value}`;
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

import _ from 'lodash';

const eol = '\n';
const splitter = '.';

const astToString = (ast, parents = []) => {
  const typeMapping = {
    added: (element, property) => {
      const value = _.isObject(element.valueAfter) ? 'complex value' : `value: ${element.valueAfter}`;
      return `Property '${property}' was added with ${value}`;
    },
    deleted: (element, property) => `Property '${property}' was removed`,
    equal: () => '',
    nested: element => astToString(element.children, [...parents, element.property]),
    modified: (element, property) =>
      `Property '${property}' was updated. From '${element.valueBefore}' to '${element.valueAfter}'`,
  };
  return ast.map(element =>
    typeMapping[element.type](element, [...parents, element.property].join(splitter)))
    .filter(el => el).join(eol);
};

export default ast => astToString(ast);

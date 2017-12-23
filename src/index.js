import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parseMethods = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseConfigFile = (extention, dataFile) => {
  if (extention in parseMethods) {
    return parseMethods[extention](dataFile);
  }
  return 'error';
};

const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8');
  const extention = path.extname(pathToFile);
  return parseConfigFile(extention, dataFile);
};

const isNewProperty = (objBefore, objAfter, property) =>
  !(property in objBefore);

const isEqualProperty = (objBefore, objAfter, property) =>
  _.isEqual(objBefore[property], objAfter[property]);

const isModfifiedProperty = (objBefore, objAfter, property) => {
  if (property in objBefore && property in objAfter) {
    return !_.isEqual(objBefore[property], objAfter[property]);
  }
  return false;
};

const isDeletedProperty = (objBefore, objAfter, property) =>
  !(property in objAfter);

const makeAst = (objBefore, objAfter) => {
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  const outputAst = properties.map((property) => {
    if (isNewProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'new',
        configAfter: objAfter[property],
      };
    }
    if (isDeletedProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'deleted',
        configBefore: objBefore[property],
      };
    }
    if (isEqualProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'equal',
        configBefore: objBefore[property],
      };
    }
    if (isModfifiedProperty(objBefore, objAfter, property)) {
      const isTowObjects = _.isObject(objBefore[property]) && _.isObject(objAfter[property]);
      if (isTowObjects) {
        const obj1 = objBefore[property];
        const obj2 = objAfter[property];
        return {
          property,
          type: 'complexModified',
          children: makeAst(obj1, obj2),
        };
      }
      return {
        property,
        type: 'modified',
        configBefore: objBefore[property],
        configAfter: objAfter[property],
      };
    }
    return {};
  });
  return outputAst;
};

const eol = '\n';
const intend = '  ';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) => `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;

const elementToComplexString = (obj, level) => {
  if (!_.isObject(obj)) {
    return obj;
  }
  const properties = Object.keys(obj);
  const outRow = properties.reduce((acc, element) => {
    const row = makeRow(element, elementToComplexString(obj[element], level + 1), ' ', level + 2);
    return `${acc}${row}`;
  }, '');
  return `${startBlock}${eol}${outRow}${intend.repeat(level + 1)}${endBlock}`;
};

const typeSelectorComplex = {
  new: (element, level) => makeRow(element.property, elementToComplexString(element.configAfter, level), '+', level),
  deleted: (element, level) => makeRow(element.property, elementToComplexString(element.configBefore, level), '-', level),
  equal: (element, level) => makeRow(element.property, elementToComplexString(element.configBefore, level), ' ', level),
  complexModified: (element, level, value) => makeRow(element.property, value, ' ', level),
  modified: (element, level) => {
    const rowAfter = makeRow(element.property, elementToComplexString(element.configAfter, level), '+', level);
    const rowBefore = makeRow(element.property, elementToComplexString(element.configBefore, level), '-', level);
    return `${rowAfter}${rowBefore}`;
  },
};

const astToComplexString = (ast, level = 1) => {
  const outString = ast.reduce((acc, element) => {
    const value = element.children ? astToComplexString(element.children, level + 2) : '';
    const astRow = typeSelectorComplex[element.type](element, level, value);
    return `${acc}${astRow}`;
  }, '');
  return `${startBlock}${eol}${outString}${intend.repeat(level - 1)}${endBlock}`;
};

const typeSelectorFlat = {
  new: (element, parent) => {
    if (_.isObject(element.configAfter)) {
      return `Property '${parent}${element.property}' was added with complex value`;
    }
    if (typeof element.configAfter === 'string') {
      return `Property '${parent}${element.property}' was added with '${element.configAfter}'`;
    }
    return `Property '${parent}${element.property}' was added with value: ${element.configAfter}`;
  },
  deleted: (element, parent) => `Property '${parent}${element.property}' was removed`,
  equal: () => '',
  complexModified: (element, parent) => parent,
  modified: (element, parent) =>
    `Property '${parent}${element.property}' was updated. From '${element.configBefore}' to '${element.configAfter}'`,
};

const astToFlatString = (ast, parentProperty = '') => ast.map((element) => {
  const parent = element.children ? astToFlatString(element.children, `${parentProperty}${element.property}.`) : parentProperty;
  return typeSelectorFlat[element.type](element, parent);
}).filter(element => element).join('\n');

const outputFormats = {
  flat: astToFlatString,
  complex: astToComplexString,
};

const makeDiff = (configBefore, configAfter, format = 'complex') => {
  const objBefore = readConfigFile(configBefore);
  const objAfter = readConfigFile(configAfter);
  return outputFormats[format](makeAst(objBefore, objAfter));
};

export default makeDiff;

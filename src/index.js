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
  const output = properties.map((property) => {
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
  return output;
};

const eol = '\n';
const intend = '  ';
const startBlock = '{';
const endBlock = '}';

const makeRow = (property, value, sign, level) => {
  const template = `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;
  return template;
};

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
      const sign = prefix[element.type];
      if (element.type === 'complexModified') {
        const astRow = makeRow(element.property, iter(element.children, level + 2), sign, level);
        return `${acc}${astRow}`;
      }
      if (element.type === 'modified') {
        const signBefore = sign[0];
        const signAfter = sign[1];
        const valueAfter = elementToString(element.configAfter, level);
        const valueBefore = elementToString(element.configBefore, level);
        const rowAfter = makeRow(element.property, valueAfter, signAfter, level);
        const rowBefore = makeRow(element.property, valueBefore, signBefore, level);
        return `${acc}${rowAfter}${rowBefore}`;
      }
      const value = element.configBefore ? element.configBefore : element.configAfter;
      return `${acc}${makeRow(element.property, elementToString(value, level), sign, level)}`;
    }, '');
    return `${startBlock}${eol}${out}${intend.repeat(level - 1)}${endBlock}`;
  };
  return iter(ast, 1);
};

const makeDiff = (configBefore, configAfter) => {
  const objBefore = readConfigFile(configBefore);
  const objAfter = readConfigFile(configAfter);
  return astToString(makeAst(objBefore, objAfter));
};

export default makeDiff;

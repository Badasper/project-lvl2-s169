import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const eol = '\n';
const intend = '  ';

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

const makeAst = (objBefore, objAfter, parentSign = ' ') => {
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  const output = properties.reduce((acc, property) => {
    const node = {
      parentSign,
      value: ['unknownProperty', 'unknownValue'],
      state: 'unknown',
      isSimple: true,
      sign: ' ',
    };

    if (isNewProperty(objBefore, objAfter, property)) {
      node.state = 'new';
      node.sign = '+';
      if (node.isSimple) {
        node.value = [property, objAfter[property]];
      }
    }
    if (isDeletedProperty(objBefore, objAfter, property)) {
      node.state = 'deleted';
      node.sign = '-';
      if (node.isSimple) {
        node.value = [property, objBefore[property]];
      }
    }
    if (isEqualProperty(objBefore, objAfter, property)) {
      node.state = 'equal';
      if (node.isSimple) {
        node.value = [property, objBefore[property]];
      }
    }
    if (isModfifiedProperty(objBefore, objAfter, property)) {
      node.state = 'modified';
      if (node.isSimple) {
        node.value = [property, objBefore[property], objAfter[property]];
      }
    }
    const isPropertyBeforObject = _.isObject(objBefore[property]);
    const isPropertyAfterObject = _.isObject(objAfter[property]);
    if (isPropertyBeforObject || isPropertyAfterObject) {
      const obj1 = isPropertyBeforObject ? objBefore[property] : {};
      const obj2 = isPropertyAfterObject ? objAfter[property] : {};
      node.value = [property, makeAst(obj1, obj2, node.sign)];
      node.isSimple = false;
    }
    return [...acc, node];
  }, []);
  return output;
};

const makeRow = (property, value, sign, level) =>
  `${intend.repeat(level)}${sign} ${property}: ${value}${eol}`;

const astToString = (ast, level = 1) => {
  const output = ast.reduce((acc, element) => {
    const property = element.value[0];
    const value = element.value[1];
    const sign = element.parentSign === ' ' ? element.sign : ' ';
    if (element.isSimple) {
      if (element.state === 'modified') {
        const valueAfter = element.value[2];
        const before = makeRow(property, value, '-', level);
        const changed = makeRow(property, valueAfter, '+', level);
        return `${acc}${changed}${before}`;
      }
      return `${acc}${makeRow(property, value, sign, level)}`;
    }
    return `${acc}${makeRow(property, astToString(value, level + 2), sign, level)}`;
  }, '');

  return `{${eol}${output}${intend.repeat(level - 1)}}`;
};

export const makeDiff = (configBefore, configAfter) => {
  const objBefore = readConfigFile(configBefore);
  const objAfter = readConfigFile(configAfter);
  return astToString(makeAst(objBefore, objAfter));
};

export default (filePathBefore, filePathAfter) =>
  makeDiff(filePathBefore, filePathAfter);

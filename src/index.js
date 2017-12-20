import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';

const eol = '\n';
const intend = '  ';

const parseConfigFile = (pathToFile, dataFile) => {
  const parseMethods = {
    '.json': f => JSON.parse(f),
    '.yaml': f => yaml.safeLoad(f),
  };
  const extention = path.extname(pathToFile);
  if (extention in parseMethods) {
    return parseMethods[extention](dataFile);
  }
  return 'error parsing method!';
};

const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8');
  return parseConfigFile(pathToFile, dataFile);
};

const makeRow = (property, obj, sign) =>
  `${intend}${sign} ${property}: ${obj[property]}${eol}`;

const isNewProperty = (objBefore, objAfter, property) =>
  !(property in objBefore);

const isEqualProperty = (objBefore, objAfter, property) =>
  (objBefore[property] === objAfter[property]);

const isMofifiedProperty = (objBefore, objAfter, property) =>
  (property in objBefore && property in objAfter && objBefore[property] !== objAfter[property]);

const isDeletedProperty = (objBefore, objAfter, property) =>
  !(property in objAfter);

export const makeDiff = (configBefore, configAfter) => {
  const objBefore = readConfigFile(configBefore);
  const objAfter = readConfigFile(configAfter);
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  const output = properties.reduce((acc, property) => {
    if (isNewProperty(objBefore, objAfter, property)) {
      return `${acc}${makeRow(property, objAfter, '+')}`;
    }
    if (isEqualProperty(objBefore, objAfter, property)) {
      return `${acc}${makeRow(property, objBefore, ' ')}`;
    }
    if (isMofifiedProperty(objBefore, objAfter, property)) {
      return `${acc}${makeRow(property, objAfter, '+')}${makeRow(property, objBefore, '-')}`;
    }
    if (isDeletedProperty(objBefore, objAfter, property)) {
      return `${acc}${makeRow(property, objBefore, '-')}`;
    }
    return acc;
  }, '');
  return `{\n${output}}`;
};

export default (filePathBefore, filePathAfter) =>
  makeDiff(filePathBefore, filePathAfter);

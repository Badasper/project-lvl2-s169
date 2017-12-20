import fs from 'fs';
import _ from 'lodash';

const eol = '\n';
const intend = '  ';

const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8');
  return JSON.parse(dataFile);
};

const makeRow = (property, obj, sign) =>
  `${intend}${sign} ${property}: ${obj[property]}${eol}`;

const isNewProperty = (objBefore, objAfter, property) =>
  (objAfter[property] && !objBefore[property]);

const isEqualProperty = (objBefore, objAfter, property) =>
  (objBefore[property] === objAfter[property]);

const isMofifiedProperty = (objBefore, objAfter, property) =>
  (objBefore[property] && objAfter[property] && objBefore[property] !== objAfter[property]);

const isDeletedProperty = (objBefore, objAfter, property) =>
  (objBefore[property] && !objAfter[property]);

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
  return `{${eol}${output}}`;
};

// for tests:
export {
  isDeletedProperty,
  isMofifiedProperty,
  isEqualProperty,
  isNewProperty,
  makeRow,
  readConfigFile,
};
// tests

export default (filePathBefore, filePathAfter) =>
  makeDiff(filePathBefore, filePathAfter);

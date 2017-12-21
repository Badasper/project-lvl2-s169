import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';
import astToString from './utilites/utils';

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
  const output = properties.reduce((acc, property) => {
    if (isNewProperty(objBefore, objAfter, property)) {
      return [...acc, {
        property,
        status: 'new',
        after: objAfter[property],
      }];
    }
    if (isDeletedProperty(objBefore, objAfter, property)) {
      return [...acc, {
        property,
        status: 'deleted',
        before: objBefore[property],
      }];
    }
    if (isEqualProperty(objBefore, objAfter, property)) {
      return [...acc, {
        property,
        status: 'equal',
        before: objBefore[property],
      }];
    }
    if (isModfifiedProperty(objBefore, objAfter, property)) {
      const isTowObjects = _.isObject(objBefore[property]) && _.isObject(objAfter[property]);
      if (isTowObjects) {
        const obj1 = objBefore[property];
        const obj2 = objAfter[property];
        return [...acc, {
          property,
          status: 'complexModified',
          astDiff: makeAst(obj1, obj2),
        }];
      }
      return [...acc, {
        property,
        status: 'modified',
        before: objBefore[property],
        after: objAfter[property],
      }];
    }
    return acc;
  }, []);
  return output;
};

const makeDiff = (configBefore, configAfter) => {
  const objBefore = readConfigFile(configBefore);
  const objAfter = readConfigFile(configAfter);
  return astToString(makeAst(objBefore, objAfter));
};

export default makeDiff;

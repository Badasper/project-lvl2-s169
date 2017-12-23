import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import getRender from './renders';
import parseConfigFile from './parser';

const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8');
  const extention = path.extname(pathToFile);
  return parseConfigFile(extention, dataFile);
};

const isaddedProperty = (objBefore, objAfter, property) =>
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
  return properties.map((property) => {
    if (isaddedProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'added',
        valueAfter: objAfter[property],
      };
    }
    if (isDeletedProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'deleted',
        valueBefore: objBefore[property],
      };
    }
    if (isEqualProperty(objBefore, objAfter, property)) {
      return {
        property,
        type: 'equal',
        valueBefore: objBefore[property],
      };
    }
    if (isModfifiedProperty(objBefore, objAfter, property)) {
      const isTowObjects = _.isObject(objBefore[property]) && _.isObject(objAfter[property]);
      if (isTowObjects) {
        const obj1 = objBefore[property];
        const obj2 = objAfter[property];
        return {
          property,
          type: 'nested',
          children: makeAst(obj1, obj2),
        };
      }
      return {
        property,
        type: 'modified',
        valueBefore: objBefore[property],
        valueAfter: objAfter[property],
      };
    }
    return {};
  });
};

const makeDiff = (valueBefore, valueAfter, format = 'complex') => {
  const objBefore = readConfigFile(valueBefore);
  const objAfter = readConfigFile(valueAfter);
  const render = getRender(format);
  return render(makeAst(objBefore, objAfter));
};

export default makeDiff;

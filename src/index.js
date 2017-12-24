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

const makeAst = (objBefore, objAfter) => {
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  return properties.map((property) => {
    if (!(property in objBefore)) {
      return {
        property,
        type: 'added',
        valueAfter: objAfter[property],
      };
    }
    if (!(property in objAfter)) {
      return {
        property,
        type: 'deleted',
        valueBefore: objBefore[property],
      };
    }
    if (_.isEqual(objBefore[property], objAfter[property])) {
      return {
        property,
        type: 'equal',
        valueBefore: objBefore[property],
      };
    }
    if (_.isObject(objBefore[property]) && _.isObject(objAfter[property])) {
      return {
        property,
        type: 'nested',
        children: makeAst(objBefore[property], objAfter[property]),
      };
    }
    return {
      property,
      type: 'modified',
      valueBefore: objBefore[property],
      valueAfter: objAfter[property],
    };
  });
};

const makeDiff = (configFileBefore, configFileAfter, format = 'complex') => {
  const objBefore = readConfigFile(configFileBefore);
  const objAfter = readConfigFile(configFileAfter);
  const render = getRender(format);
  return render(makeAst(objBefore, objAfter));
};

export default makeDiff;

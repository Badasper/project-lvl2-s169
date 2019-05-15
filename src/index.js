import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import getRender from './renders';
import parseConfigFile from './parsers';

const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8');
  const extention = path.extname(pathToFile);
  return parseConfigFile(extention, dataFile);
};

const typeOfDiff = (objBefore, objAfter, property) => {
  const state = {
    added: !(property in objBefore),
    deleted: !(property in objAfter),
    equal: _.isEqual(objBefore[property], objAfter[property]),
    nested: _.isObject(objBefore[property]) && _.isObject(objAfter[property]),
  };
  return Object.keys(state).filter(el => state[el])[0] || 'modified';
};

const makeAst = (objBefore, objAfter) => {
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  return properties.map((property) => {
    const typeOfModification = typeOfDiff(objBefore, objAfter, property);
    if (typeOfModification === 'nested') {
      return {
        property,
        type: typeOfModification,
        children: makeAst(objBefore[property], objAfter[property]),
      };
    }
    return {
      property,
      type: typeOfModification,
      valueBefore: objBefore[property],
      valueAfter: objAfter[property],
    };
  });
};

const makeDiff = (configFileBefore, configFileAfter, format = 'complex') => {
  const objBefore = readConfigFile(configFileBefore);
  const objAfter = readConfigFile(configFileAfter);
  const render = getRender(format);
  return render.toString(makeAst(objBefore, objAfter));~
};

export default makeDiff;

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

const typeOfModification = (objBefore, objAfter, property) => {
  const stats = {
    added: !(property in objBefore),
    deleted: !(property in objAfter),
    equal: _.isEqual(objBefore[property], objAfter[property]),
    nested: _.isObject(objBefore[property]) && _.isObject(objAfter[property]),
  };
  const [status] = Object.keys(stats).filter(el => stats[el]);
  return status || 'modified';
};

const makeAst = (objBefore, objAfter) => {
  const properties = _.union(Object.keys(objBefore), Object.keys(objAfter));
  return properties.map((property) => {
    const type = typeOfModification(objBefore, objAfter, property);
    const ast = { property, type };
    const valueBefore = objBefore[property];
    const valueAfter = objAfter[property];
    if (type === 'nested') {
      return { ...ast, children: makeAst(valueBefore, valueAfter) };
    }
    return { ...ast, valueBefore, valueAfter };
  });
};

const makeDiff = (configFileBefore, configFileAfter, format = 'complex') => {
  const objBefore = readConfigFile(configFileBefore);
  const objAfter = readConfigFile(configFileAfter);
  const render = getRender(format);
  return render.toString(makeAst(objBefore, objAfter));
};

export default makeDiff;

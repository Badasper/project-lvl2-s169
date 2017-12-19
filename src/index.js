import fs from 'fs';

const eol = '\n';

export const readConfigFile = (pathToFile) => {
  const dataFile = fs.readFileSync(pathToFile, 'utf-8', (err, data) => {
    if (err) throw err;
    return data;
  });
  return JSON.parse(dataFile);
};

const makeRow = (property, obj, sign) =>
  `${sign} ${property}: ${obj[property]}${eol}`;

export const getNewProperty = (objBefore, objAfter) => {
  const properties = Object.keys(objAfter);
  return properties.reduce((acc, property) => {
    if (objAfter[property] && !objBefore[property]) {
      return acc + makeRow(property, objAfter, '+');
    }
    return acc;
  }, '');
};

export const getEqualProperty = (objBefore, objAfter) => {
  const properties = Object.keys(objBefore);
  return properties.reduce((acc, property) => {
    if (objBefore[property] === objAfter[property]) {
      return acc + makeRow(property, objBefore, ' ');
    }
    return acc;
  }, '');
};

export const getMofifiedProperty = (objBefore, objAfter) => {
  const properties = Object.keys(objAfter);
  return properties.reduce((acc, property) => {
    if (objBefore[property] && objBefore[property] !== objAfter[property]) {
      return acc + makeRow(property, objAfter, '+') + makeRow(property, objBefore, '-');
    }
    return acc;
  }, '');
};

export const getDeletedProperty = (objBefore, objAfter) => {
  const properties = Object.keys(objBefore);
  return properties.reduce((acc, property) => {
    if (objBefore[property] && !objAfter[property]) {
      return acc + makeRow(property, objBefore, '-');
    }
    return acc;
  }, '');
};

export const makeDiff = (filePathBefore, filePathAfter) => {
  const dataBefore = readConfigFile(filePathBefore);
  const dataAfter = readConfigFile(filePathAfter);
  const equalProp = getEqualProperty(dataBefore, dataAfter);
  const changedProp = getMofifiedProperty(dataBefore, dataAfter);
  const deletedProp = getDeletedProperty(dataBefore, dataAfter);
  const newProp = getNewProperty(dataBefore, dataAfter);
  return `{${eol}${equalProp}${changedProp}${deletedProp}${newProp}}`;
};

export default (filePathBefore, filePathAfter) =>
  makeDiff(filePathBefore, filePathAfter);

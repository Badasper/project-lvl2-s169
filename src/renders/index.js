import astToJson from './json';
import astToPretty from './pretty';
import astToPlain from './plain';

const outputFormats = {
  plain: { toString: astToPlain },
  complex: { toString: astToPretty },
  json: { toString: astToJson },
};

export default format => outputFormats[format];

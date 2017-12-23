import astToJson from './json';
import astToPretty from './pretty';
import astToPlain from './plain';

const outputFormats = {
  plain: astToPlain,
  complex: astToPretty,
  json: astToJson,
};

export default format => outputFormats[format];

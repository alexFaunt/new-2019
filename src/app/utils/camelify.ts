import * as camelCase from 'lodash/fp/camelCase';
import * as isPlainObject from 'lodash/fp/isPlainObject';

export default function camelify(obj) {
  if (Array.isArray(obj)) {
    return obj.map(camelify);
  }

  if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((acc, key) => ({
      ...acc,
      [camelCase(key)]: camelify(obj[key]),
    }), {});
  }
  return obj;
}

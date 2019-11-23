import * as ru from 'src/i18ns/ru';
import * as en from 'src/i18ns/en';
import _ from 'lodash';

function deepKeys(obj) {
  const res = {};
  for (let key in obj) {
    const value = obj[key];
    res[key] = _.isObject(value) ? deepKeys(value) : {};
  }
  return res;
}

describe("i18ns", function() {
  it("should have same structure", function() {
    const ruKeys = deepKeys(ru);
    const enKeys = deepKeys(en);

    expect(ruKeys).toEqual(enKeys);
  });
});

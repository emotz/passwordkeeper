import _ from 'lodash';

/**
 * All properties of all objects from arr2 are merged (extended) to arr1.
 * @param {Object[]} arr1 Array to merge to
 * @param {Object[]} arr2 Array to merge from
 * @param {string} [prop=id] Determines uniqueness of objects by value of specified property
 * @param {Function} [ctor] Function to construct default element to push into arr1 if element from arr2 is not found in arr1
 */
export function merge_arrays_of_objects(arr1, arr2, prop, ctor) {
  prop = prop || 'id';
  arr2.forEach(function(element) {
    let item = arr1.find(item => item[prop] === element[prop]);
    if (item === undefined) {
      item = ctor === undefined ? {} : ctor();
      _.extend(item, element);
      arr1.push(item);
    } else {
      _.extend(item, element);
    }
  }, this);
  let ids_to_remove = arr1
        .map(i => i.id)
        .filter(i => i !== undefined)
        .filter(i => arr2.find(j => j.id === i) === undefined);
  ids_to_remove.forEach(i => {
    let index_to_remove = arr1.findIndex(j => j.id === i);
    arr1.splice(index_to_remove, 1);
  });
}

export const generateUniqueId = _.uniqueId;

export const upsert = (array = [], callback, element) => {
  const itemIndex = array.findIndex(callback);
  if (itemIndex > -1) array[itemIndex] = element;
  else array.push(element);

  return array;
};

export const formalize = (data, callback) =>
  Array.from(data, ([key, value]) => callback(key, value));

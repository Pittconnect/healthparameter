export const sumObjectsByKey = (objects) => {
  return objects.reduce((acc, current) => {
    for (const key in current) {
      if (current.hasOwnProperty(key))
        acc[key] = (acc[key] || 0) + current[key];
    }
    return acc;
  }, {});
};

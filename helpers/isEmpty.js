module.exports = function (val) {
  if (typeof val !== "object" && !val) return true;
  if (Array.isArray(val) && val.length === 0) return true;
  if (typeof val === "object" && JSON.stringify(val) === "{}") return true;
  return false;
};

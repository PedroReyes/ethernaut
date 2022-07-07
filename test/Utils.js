// export function log(string) {
//   if (process.env.NODE_ENV !== "test") {
//     console.log(string);
//   }
// }

// Utils.js
// ========
module.exports = {
  log: function (string) {
    if (process.env.NODE_ENV !== "test") {
      console.log(string);
    }
  },
};

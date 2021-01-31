const Enum = require('enum');

module.exports = new Enum({
  User: {
    type: 1,
    tokenExpireDayCount: 30,
  },
  Courier: {
    type: 2,
    tokenExpireDayCount: 30,
  },
  Admin: {
    type: 3,
    tokenExpireDayCount: 2,
  },
});

const Enum = require('enum');

module.exports = new Enum({
  User: {
    Id: 1,
    TokenExpireDayCount: 30,
  },
  Courier: {
    Id: 2,
    TokenExpireDayCount: 30,
  },
  Admin: {
    Id: 3,
    TokenExpireDayCount: 5,
  },
  Internal: {
    Id: 4,
    TokenExpireDayCount: 5,
  },
});

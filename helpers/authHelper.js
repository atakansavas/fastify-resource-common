const Config = require('../config');

const authHelper = {
  getLoginQuery: (params) => {
    return {
      phoneNumber: params.phoneNumber,
    };
  },
};

module.exports = authHelper;

const settingsHelper = {
  getGroupSchema: (groupId) => {
    switch (groupId) {
      case 1:
        return require('../settings/system/schema');
      case 2:
        return require('../settings/system/schema');
      case 3:
        return require('../settings/system/schema');
      default:
        return null;
        break;
    }
  },
};

module.exports = settingsHelper;

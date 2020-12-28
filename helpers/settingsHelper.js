const settingsHelper = {
  getGroupSchema: (groupId) => {
    switch (groupId) {
      case 1:
        return require('../settings/system/schema').settingSchema;
      case 2:
        return require('../settings/system/schema').settingSchema;
      case 3:
        return require('../settings/system/schema').settingSchema;
      default:
        return null;
        break;
    }
  },
};

module.exports = settingsHelper;

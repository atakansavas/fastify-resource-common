const settingsHelper = {
  getGroupSchema: (groupId) => {
    switch (groupId) {
      case 1:
        return require('../settings/system/schema').settingSchema;
      case 2:
        return require('../settings/packageType/schema').settingSchema;
      case 3:
        return require('../settings/vehicleType/schema').settingSchema;
      case 4:
        return require('../settings/zonePrices/schema').settingSchema;
      case 5:
        return require('../settings/durationPrices/schema').settingSchema;
      default:
        return null;
        break;
    }
  },
};

module.exports = settingsHelper;

const Enum = require('../../base/enum/index');

const SystemSettings = new Enum({
  TCKNCheck: '1',
  KDVRate: '2',
  StartingPrice: '3',
  StepPrice: '4',
  AppVersion: '5',
  BridgePrice: '6',
  KMPrice: '7',
  PlannedOrderVisibleTime: '8',
});

module.exports = SystemSettings;

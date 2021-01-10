const Groups = require('./settingGroups');

const System = require('./settings/systemSettings');
const PackageTypes = require('./settings/packageTypes');
const VehicleTypes = require('./settings/vehicleTypes');
const DurationPrices = require('./settings/durationPrices');
const DistancePrices = require('./settings/distancePrices');
const Zones = require('./settings/zones');
const PricingTypes = require('./pricingTypes');
const OrderTypes = require('./orderTypes');
const AddressTypes = require('./addressTypes');

module.exports = {
  Groups,
  System,
  PackageTypes,
  VehicleTypes,
  PricingTypes,
  OrderTypes,
  AddressTypes,
  Zones,
  DurationPrices,
  DistancePrices,
};

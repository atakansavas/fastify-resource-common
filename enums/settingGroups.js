const Enum = require('../base/enum/index');

const SettingGroups = new Enum({
  //* Sistem ayarlari icin
  System: '1',
  //* Paket tipi
  PackageType: '2',
  //* Arac tiplero
  VehicleType: '3',
  //* Zone ucretleri
  ZonePrices: '4',
  //* Sure ucretleri
  DurationPrices: '5',
});

module.exports = SettingGroups;

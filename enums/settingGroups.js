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
  //* Mesafe ucretleri
  DistancePrices: '5',
  //* Yaka ucretleri
  SidePrices: '6',
});

module.exports = SettingGroups;

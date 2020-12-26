const Enum = require('../base/enum/index');

const SettingGroups = new Enum({
  //* Sistem ayarlari icin
  System: '1',
  //* Km ucretleri
  Price: '2',
  //* Saat ucretleri
  SureUcretleri: '3',
});

module.exports = SettingGroups;

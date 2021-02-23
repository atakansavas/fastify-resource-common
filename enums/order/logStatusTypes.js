const Enum = require('enum');

module.exports = new Enum({
  Assigned: {
    Id: 1,
    Desc: 'Kuryeye atandı.',
  },
  Picked: {
    Id: 2,
    Desc: 'Teslim alindi.',
  },
  Departed: {
    Id: 3,
    Desc: 'Kurye dağıtıma çıktı.',
  },
  Transfered: {
    Id: 3,
    Desc: 'Paket transfer edildi.',
  },
  Succeed: {
    Id: 4,
    Desc: 'Gönderim tamamlandı.',
  },
  Fail: {
    Id: 5,
    Desc: 'Gönderim tamamlanamadı.',
  },
});

const Enum = require('enum');

module.exports = new Enum({
  Assigned: {
    Id: 1,
    Desc: 'Kuryeye atandı.',
    OrderStatusId: 1,
  },
  Picked: {
    Id: 2,
    Desc: 'Teslim alindi.',
    OrderStatusId: 2,
  },
  Departed: {
    Id: 3,
    Desc: 'Kurye dağıtıma çıktı.',
    OrderStatusId: 2,
  },
  Transfered: {
    Id: 4,
    Desc: 'Paket transfer edildi.',
  },
  Succeed: {
    Id: 5,
    Desc: 'Gönderim tamamlandı.',
    OrderStatusId: 4,
  },
  Fail: {
    Id: 6,
    Desc: 'Gönderim tamamlanamadı.',
    OrderStatusId: 5,
  },
});

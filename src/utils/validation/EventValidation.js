export const validateEvent = ({ name, eventTime, capacity }) => {
  const errors = {};

  if (!name || name.trim() === "") {
    errors.name = "Etkinlik adı zorunludur.";
  }

  if (!eventTime) {
    errors.eventTime = "Etkinlik tarihi zorunludur.";
  } else {
    const selectedDate = new Date(eventTime);
    const now = new Date();

    if (isNaN(selectedDate.getTime())) {
      errors.eventTime = "Geçerli bir tarih giriniz.";
    } else if (selectedDate < now) {
      errors.eventTime = "Etkinlik tarihi bugünün tarihinden önce olamaz.";
    }
  }

  const capacityNumber = parseInt(capacity);
  if (!capacity || isNaN(capacityNumber)) {
    errors.capacity = "Kapasite zorunludur.";
  } else if (capacityNumber < 1) {
    errors.capacity = "Kapasite 0'dan büyük olmalıdır.";
  }

  return errors;
};
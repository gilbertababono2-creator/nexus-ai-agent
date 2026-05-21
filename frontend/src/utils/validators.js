export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

export const isValidTime = (time) => {
  const re = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return re.test(time);
};

const unixTime = () => {
  return (new Date().getTime() / 1000) | 0;
};

module.exports = {
  unixTime,
};

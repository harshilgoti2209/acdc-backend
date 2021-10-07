const systemLog = require("./setup");

//save system log in the database
const saveSystemLog = (data) => {
  try {
    const log = new systemLog(data);
    log.save();
  } catch (err) {
    console.log(err);
  }
};

//return all system logs in the database
const allSystemLog = async () => {
  try {
    const result = await systemLog.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  saveSystemLog,
  allSystemLog,
};

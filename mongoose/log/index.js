const Log = require("./setup");

//create iot device in database
const saveLog = (data) => {
  try {
    const log = new Log(data);
    log.save();
  } catch (err) {
    console.log(err);
  }
};

const updateLog = async (name, data) => {
  try {
    await Log.updateMany({ name }, { $set: data });
  } catch (err) {
    console.log(err);
  }
};

const deleteLog = () => {};

const searchLog = async (name) => {
  try {
    const result = await Log.find({ name });
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  saveLog: saveLog,
  updateLog: updateLog,
  deleteLog: deleteLog,
  searchLog: searchLog,
};

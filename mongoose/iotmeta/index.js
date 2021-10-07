const Iotmeta = require("./setup");

//create iot device in database
const saveIotmeta = (data) => {
  try {
    const iot = new Iotmeta(data);
    iot.save();
  } catch (err) {
    console.log(err);
  }
};

//update entry with macaddress = name with  data(object)
const updateIotmeta = async (name, data) => {
  try {
    await Iotmeta.updateMany( name , { $set: data });
  } catch (err) {
    console.log(err);
  }
};

const searchIotmeta = async (query) => {
  try {
    const result = await Iotmeta.find(query);
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  saveIotmeta,
  updateIotmeta,
  searchIotmeta,
};

const Iot = require("./setup");

//create iot device in database
const saveIot = (data) => {
  try {
    const iot = new Iot(data);
    iot.save();
  } catch (err) {
    console.log(err);
  }
};

//update entry with macaddress = name with  data(object)
const updateIot = async (name, data) => {
  try {
    await Iot.updateMany( name , { $set: data });
  } catch (err) {
    console.log(err);
  }
};

const searchIot = async (query) => {
  try {
    const result = await Iot.find(query);
    return result;
  } catch (err) {
    console.log(err);
  }
};

const allIot = async () => {
  try {
    const result = await Iot.find(
      {},
      {
        _id: 0,
      }
    );
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  saveIot: saveIot,
  updateIot: updateIot,
  searchIot: searchIot,
  allIot: allIot,
};

const User = require("./setup");

//create user in database
const createUser = (data) => {
  try {
    const user = new User(data);
    user.save();
  } catch (err) {
    console.log(err);
  }
};

//update entry with email=email
const updateUser = async (email, data) => {
  try {
    await User.updateOne({ email }, { $set: data });
  } catch (err) {
    console.log(err);
  }
};

//search user in database with data
const searchUser = async (data) => {
  try {
    const result = await User.find(data, {
      _id: 0,
      __v: 0,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

//return all users in database
const allUser = async () => {
  try {
    const result = await User.find(
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

const deleteUser = async (email) => {
  try {
    await User.deleteOne({ email });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createUser,
  updateUser,
  allUser,
  searchUser,
  deleteUser,
};

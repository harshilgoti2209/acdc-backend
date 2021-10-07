const { saveSystemLog } = require("../mongoose/systemlog/index");
const { unixTime } = require("../helper");

const pingIot = (sockets) => {
  for (let [name, socket] of sockets) {
    socket.write(`(${name}AASH)`);
    saveSystemLog({ name: "server", log: `(${name}AASH)`, time: unixTime() });
  }
};

module.exports = pingIot;

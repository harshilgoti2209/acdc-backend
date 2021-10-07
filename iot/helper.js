const { saveIot, updateIot, searchIot } = require("../mongoose/iot/index");
const {
  saveIotmeta,
  updateIotmeta,
  searchIotmeta,
} = require("../mongoose/iotmeta/index");
const { saveLog } = require("../mongoose/log/index");

const startIot = (name) => {
  searchIotmeta({ name }).then((data) => {
    if (data.length === 0) {
      saveIot({
        name,
        code: "AA",
        user: "",
        nick: name,
        limit: 0,
        current: 0,
        status: 0,
        slevel: 1,
        slimit: 10000,
        sstatus: 1,
        percent: 0,
        mode: 0,
        index:-1,
      });
      saveIotmeta({
        name,
        user: "",
        address: "xyz",
        actived: 1,
      });
    } else {
      updateIotmeta({ name }, { actived: 1 });
    }
  });
};

const closeIot = (name) => {
  updateIotmeta({ name }, { actived: 0 });
};

const modifyLog = (name, code, log) => {
  let switchStatus = log[0];
  let meterCount = "",
    index = "",
    timeStamp = "";
  let i;
  for (i = 2; i < log.length; i++) {
    if (log[i] != "I") meterCount += log[i];
    else break;
  }
  for (i = i + 1; i < log.length; i++) {
    if (log[i] != "T") index += log[i];
    else break;
  }
  for (i = i + 1; i < log.length; i++) {
    timeStamp += log[i];
  }
  switchStatus = parseInt(switchStatus, 10);
  meterCount = parseInt(meterCount, 10);
  saveLog({
    name,
    code,
    switchStatus,
    meterCount,
    index: parseInt(index, 10),
    timeStamp: parseInt(timeStamp, 10),
  });
  searchIot({ name, code }).then((data) => {
    let obj = data[0];
    if (obj.index < parseInt(index, 10)) {
      updateIot(
        { name, code },
        {
          percent: (meterCount + obj.mode * obj.current) / obj.limit,
          current: meterCount + obj.mode * obj.current,
          status: switchStatus,
          index: parseInt(index, 10),
        }
      );
    }
  });
};

module.exports = {
  startIot,
  closeIot,
  modifyLog,
};

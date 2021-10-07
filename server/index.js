const net = require("net");
const { saveIot, updateIot, searchIot } = require("../mongoose/iot/index");
const {
  searchUser,
  createUser,
  allUser,
  updateUser,
  deleteUser,
} = require("../mongoose/users/index");
const { updateIotmeta, searchIotmeta } = require("../mongoose/iotmeta/index");
const { saveSystemLog, allSystemLog } = require("../mongoose/systemlog/index");
const { startIot, closeIot, modifyLog } = require("../iot/helper");
const { unixTime } = require("../helper");
const server = net.createServer();
const PORT = 5001;
const pingIot = require("./pingIot");

//store all sockets
const sockets = new Map();

server.on("connection", (socket) => {
  let name, code, log, subName;
  socket.on("data", (data) => {
    data = "" + data;
    saveSystemLog({ name: "device", log: data, time: unixTime() });
    name = data.substring(1, 13);
    subName = data.substring(13, 15);
    code = data.substring(15, 17);
    log = data.substring(17, data.length - 1);
    switch (code) {
      case "DR":
        sockets.set(name, socket);
        startIot(name);
        socket.write(`(${name}${subName}SR${unixTime()})`);
        saveSystemLog({
          name: "server",
          log: `(${name}${subName}SR${unixTime()})`,
          time: unixTime(),
        });
        break;
      case "DS":
        modifyLog(name, subName, log);
        socket.write(`(${name}${subName}SS${log})`);
        saveSystemLog({
          name: "server",
          log: `(${name}${subName}SS${log})`,
          time: unixTime(),
        });
        break;
      case "DW":
        updateIot({ name, code: subName }, { status: parseInt(log, 10) });
        break;
      case "DC":
        updateIot({ name, code: subName }, { limit: parseInt(log, 10), index:-1 });
        break;
      case "DA":
        updateIotmeta({ name }, { actived: 1 });
        socket.write(`(${name}AASA)`);
        saveSystemLog({
          name: "server",
          log: `(${name}AASA)`,
          time: unixTime(),
        });
        break;
      case "DH":
        updateIotmeta({ name }, { actived: 1 });
        break;
      default:
        break;
    }
  });

  socket.on("error", (error) => {
    sockets.delete(name);
    closeIot(name);
    socket.destroy();
    console.log("connection is removed due to error");
  });

  socket.once("end", () => {
    sockets.delete(name);
    closeIot(name);
    console.log("connection is removed");
  });

  console.log("connection is made");
});

// error in creating server
server.on("error", (error) => {
  console.log(error);
});

// ping IOTs
const MINUTE = 1000 * 30;
server.listen(PORT);
setInterval(() => {
  pingIot(sockets);
}, MINUTE);

const app = require("./express");

//return all iots  informations as a array
app.post("/iots", (req, res) => {
  searchIot({ user: req.body.name }).then((data) => {
    searchIotmeta({ user: req.body.name }).then((meta) => {
      res.status(200).send({
        meta,
        data,
      });
    });
  });
});

app.post("/", (req, res) => {
  let { name, code, subName } = req.body;
  const socket = sockets.get(name);
  if (socket) {
    if (code === "SC") {
      socket.write(`(${name}${subName}SC${req.body.limit})`);
      saveSystemLog({
        name: "server",
        log: `(${name}${subName}SC${req.body.limit})`,
        time: unixTime(),
      });
    } else if (code === "SW") {
      socket.write(`(${name}${subName}SW${req.body.status})`);
      saveSystemLog({
        name: "server",
        log: `(${name}${subName}SW${req.body.status})`,
        time: unixTime(),
      });
    }
  }
  res.status(200).send("SUCCESS");
});

app.post("/login", (req, res) => {
  searchUser({ email: req.body.email, password: req.body.password }).then(
    (data) => {
      if (data.length > 0) {
        res.status(200).send(data[0]);
      } else {
        res.status(400).send("Incorrect email/password");
      }
    }
  );
});

app.post("/signup", (req, res) => {
  searchUser({ email: req.body.email }).then((data) => {
    if (data.length === 0) {
      createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      res.status(200).send("SUCCESS");
    } else {
      res.status(200).send("email already exists");
    }
  });
});

app.get("/users", (req, res) => {
  allUser().then((data) => {
    res.status(200).send(data);
  });
});

app.post("/deleteuser", (req, res) => {
  const email = req.body.email;
  deleteUser(email).then(() => {
    updateIotmeta({ user: email }, { user: "" });
    res.status(200).send("SUCCESS");
  });
});

app.post("/updateuser", (req, res) => {
  const email = req.body.email;
  updateUser(email, req.body).then(() => {
    res.status(200).send("SUCCESS");
  });
});

app.get("/logs", (req, res) => {
  allSystemLog().then((data) => {
    res.status(200).send(data);
  });
});

app.post("/getuser", (req, res) => {
  searchUser({ email: req.body.email }).then((data) => {
    if (data.length > 0) {
      res.status(200).send(data[0]);
    } else {
      res.status(200).send({});
    }
  });
});

app.get("/freeiots", (req, res) => {
  searchIotmeta({ user: "" }).then((data) => {
    res.status(200).send(data);
  });
});

app.post("/saveiot", (req, res) => {
  const { name, code } = req.body;
  updateIot({ name, code }, req.body);
  res.status(200).send("SUCCESS");
});

app.post("/createiot", (req, res) => {
  const { name, user } = req.body;
  searchIot({ name }).then((data) => {
    let cnt = data.length + 27;
    let code = "";
    while (cnt > 0) {
      code = String.fromCharCode(65 + ((cnt - 1) % 26)) + code;
      cnt = Number.parseInt((cnt - 1) / 26, 10);
    }
    saveIot({
      name,
      code,
      user,
      slevel: 1,
      slimit: 1,
      sstatus: 1,
      current: 0,
      limit: 0,
      status: 0,
      mode: 0,
      percent: 0,
      index:-1,
      nick: name,
    });
  });
  res.status(200).send("SUCCESS");
});

app.post("/assigniot", (req, res) => {
  const { name, device } = req.body;
  updateIotmeta({ name: device }, { user: name }).then(() => {
    updateIot({ name: device }, { user: name }).then(() => {
      res.status(200).send("SUCCESS");
    });
  });
});

searchUser({ email: "admin" }).then((data) => {
  if (data.length === 0) {
    createUser({
      name: "admin",
      email: "admin",
      password: "admin",
      role: 0,
    });
  }
});

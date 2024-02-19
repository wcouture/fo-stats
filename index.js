const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
const port = 3000;

const player_data = load_player_data();

app.get("/", (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});

app.get("/get-player-data", (req, res) => {
  res.send(JSON.stringify(player_data));
});

app.get("/new-player", (req, res) => {
  res.sendFile("pages/new-player.html", { root: __dirname });
});

app.get("/:dir/:file", (req, res) => {
  res.sendFile(`${req.params.dir}/${req.params.file}`, { root: __dirname });
});

app.get("/admin", (req, res) => {
  res.send(JSON.stringify(player_data));
});

app.post("/add-player", (req, res) => {
  const player = req.body;
  write_player_data(player);
});

app.post("/add-win", (req, res) => {
  let index = player_data.players.findIndex(
    (player) => player.number == req.body.player_num,
  );
  let player = player_data.players[index];

  if (player == null) {
    res.send('{"status" : "error"}');
    return;
  }

  player.wins = player.wins + 1;
  res.send('{"status" : "success"}');
  save_player_data();
});

app.post("/add-loss", (req, res) => {
  let index = player_data.players.findIndex(
    (player) => player.number == req.body.player_num,
  );
  let player = player_data.players[index];

  if (player == null) {
    res.send('{"status" : "error"}');
    return;
  }

  player.losses = player.losses + 1;
  res.send('{"status" : "success"}');
  save_player_data();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function write_player_data(player) {
  player.wins = 0;
  player.losses = 0;
  player_data.players.push(player);
  player_data.count = player_data.players.length;
  save_player_data();
}

function load_player_data() {
  fs.readFile("data/p_data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    data = JSON.parse(data);
    player_data.players = data.players;
    player_data.count = data.count;
  });

  return { players: [], count: 0 };
}

function save_player_data() {
  fs.writeFile("data/p_data.json", JSON.stringify(player_data), (err) => {
    if (err) console.log(err);
  });
}

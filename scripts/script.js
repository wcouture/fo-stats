const filePath = "./names.txt";
const player_list = document.getElementById("player_list");
const divider = document.createElement("div");
divider.className = "divider";

function refresh() {
  window.location.href = "/";
}

function get_player_data() {
  console.log("getting player data");
  data = http_request("GET", "/get-player-data", {}, (data) => {
    populate_screen_dashboard(data);
  });

  return data;
}

function add_win(player_num) {
  let wins = document.getElementById("win_input_" + player_num);
  let win_value = wins.value;

  http_request("POST", "/add-win", { player_num: player_num, value: win_value }, (res) => {
    refresh();
  });
}

function add_loss(player_num) {
  let losses = document.getElementById("loss_input_" + player_num);
  let loss_value = losses.value;

  http_request("POST", "/add-loss", { player_num: player_num, value: loss_value }, () => {
    refresh();
  });
}

function add_gb(player_num) {
  let gbs = document.getElementById("gb_input_" + player_num);
  let gb_value = gbs.value;

  http_request("POST", "/add-gb", { player_num: player_num, value: gb_value }, () => {
    refresh();
  });
}

get_player_data();

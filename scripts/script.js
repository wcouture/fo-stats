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
  http_request("POST", "/add-win", { player_num: player_num }, (res) => {
    refresh();
  });
}

function add_loss(player_num) {
  http_request("POST", "/add-loss", { player_num: player_num }, () => {
    refresh();
  });
}

function add_gb(player_num) {
  http_request("POST", "/add-gb", { player_num: player_num }, () => {
    refresh();
  });
}

get_player_data();

const filePath = "./names.txt";
const player_list = document.getElementById("player_list");
const divider = document.createElement("div");
divider.className = "divider";

function refresh() {
  window.location.href = "/";
}

function http_request(method, route, data, callback) {
  let config = {
    method: method,
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (method == "POST") config.body = JSON.stringify(data);

  const response = fetch(route, config)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
      return data;
    });
}

function get_player_data() {
  console.log("getting player data");
  data = http_request("GET", "/get-player-data", {}, (data) => {
    populate_screen(data);
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

function populate_screen(player_data) {
  let player_num = player_data.count;
  for (let i = 0; i < player_num; i++) {
    let player_card = document.createElement("div");
    player_card.className = "content-body player-card";
    let curr_player = player_data.players[i];

    let wins = parseFloat(curr_player.wins);
    let losses = parseFloat(curr_player.losses);
    let win_p = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

    let line_break = document.createElement("br");

    let label = document.createElement("p");
    let detail = document.createElement("p");
    detail.className = "detail";

    let label_data = curr_player.name + "  #" + curr_player.number.toString();
    var data = "Wins: " + curr_player.wins + "<br>";
    data += "Losses: " + curr_player.losses + "<br>";
    data += "Win %: " + win_p.toPrecision(4) + "<br>";
    data += "GBs: " + curr_player.gb + "<br>";

    detail.innerHTML = data;
    label.textContent = label_data;
    label.className = "player-label";

    let win_btn = document.createElement("a");
    win_btn.className = "stat-button button1";
    let loss_btn = document.createElement("a");
    loss_btn.className = "stat-button button1";
    let gb_btn = document.createElement("a");
    gb_btn.className = "stat-button button1";

    win_btn.text = "Add Win";
    loss_btn.text = "Add Loss";
    gb_btn.text = "GB";

    win_btn.onclick = () => add_win(curr_player.number);
    loss_btn.onclick = () => add_loss(curr_player.number);
    gb_btn.onclick = () => add_gb(curr_player.number);

    player_list.appendChild(player_card);
    player_card.appendChild(label);
    player_card.appendChild(detail);
    detail.appendChild(win_btn);
    detail.appendChild(loss_btn);
    detail.appendChild(line_break);
    detail.appendChild(gb_btn);

    player_list.appendChild(divider);
  }
  if (player_num == 0) {
    let no_player_label = document.createElement("p");
    no_player_label.class = "content-header";
    no_player_label.textContent = "No players";
    player_list.appendChild(no_player_label);
  }
}

get_player_data();

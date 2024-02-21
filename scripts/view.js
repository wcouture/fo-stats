function populate_screen(player_data) {
  let player_list = document.getElementById("page-content");
  let player_num = player_data.count;
  for (let i = 0; i < player_num; i++) {
    let player_card = document.createElement("div");
    player_card.className = "content-body player-card";
    let curr_player = player_data.players[i];

    let wins = parseFloat(curr_player.wins);
    let losses = parseFloat(curr_player.losses);
    let win_p = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

    let label = document.createElement("p");
    let detail = document.createElement("p");
    detail.className = "detail";

    let label_data = curr_player.name + "  #" + curr_player.number.toString();
    let data = gen_table(curr_player);
    /*
    var data = "<b>Wins:</b> " + curr_player.wins + "<br>";
    data += "<b>Losses:</b> " + curr_player.losses + "<br>";
    data += "<b>Win %:</b> " + win_p.toPrecision(4) + "<br>";
    data += "<b>GBs:</b> " + curr_player.gb + "<br>";
    */

    detail.innerHTML = data;
    label.textContent = label_data;
    label.className = "player-label";

    player_list.appendChild(player_card);
    player_card.appendChild(label);
    player_card.appendChild(detail);
  }
  if (player_num == 0) {
    let no_player_label = document.createElement("p");
    no_player_label.class = "content-header";
    no_player_label.textContent = "No players";
    player_list.appendChild(no_player_label);
  }
}

function gen_table(player_info) {
  let wins = parseFloat(player_info.wins);
  let losses = parseFloat(player_info.losses);

  let win_p = wins / (wins + losses) * 100;
  var output = `
  <table>
    <tr>
      <th style="width: 67%" ><b>Wins:</b></th>
      <th>${player_info.wins}</th>
    </tr>
    <tr>
      <th><b>Losses:</b></th>
      <th>${player_info.losses}</th>
    </tr>
    <tr>
      <th><b>Win %:</b></th>
      <th>${win_p.toPrecision(4)}%</th>
    </tr>
    <tr>
      <th><b>GBs:</b></th>
      <th>${player_info.gb}</th>
    </tr>
  </table>
	`;
  return output;
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

http_request("GET","/get-player-data", null, (data) => populate_screen(data));

function populate_screen_dashboard(player_data) {
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
    var data = gen_table(curr_player);
    /*
    var data = "Wins: " + curr_player.wins + "<br>";
    data += "Losses: " + curr_player.losses + "<br>";
    data += "Win %: " + win_p.toPrecision(4) + "<br>";
    data += "GBs: " + curr_player.gb + "<br>";
    */

    detail.innerHTML = data;
    label.textContent = label_data;
    label.className = "player-label";

    let win_btn = document.createElement("a");
    win_btn.className = "stat-button button1";
    let win_input = document.createElement("input");
    win_input.type = "number";
    win_input.className = "stat-input";
    win_input.id = "win_input_" + curr_player.number;
    win_input.value = 0;

    let loss_btn = document.createElement("a");
    loss_btn.className = "stat-button button1";
    let loss_input = document.createElement("input");
    loss_input.type = "number";
    loss_input.className = "stat-input";
    loss_input.id = "loss_input_" + curr_player.number;
    loss_input.value = 0;
	
    let gb_btn = document.createElement("a");
    gb_btn.className = "stat-button button1";
    let gb_input = document.createElement("input");
    gb_input.type = "number";
    gb_input.className = "stat-input";
    gb_input.id = "gb_input_" + curr_player.number;
    gb_input.value = 0;


    win_btn.text = "Add Wins";
    loss_btn.text = "Add Losses";
    gb_btn.text = "Add GBs";

    win_btn.onclick = () => add_win(curr_player.number);
    loss_btn.onclick = () => add_loss(curr_player.number);
    gb_btn.onclick = () => add_gb(curr_player.number);

    player_list.appendChild(player_card);
    player_card.appendChild(label);
    player_card.appendChild(detail);
    detail.appendChild(win_btn);
    detail.appendChild(win_input);
    detail.appendChild(loss_btn);
    detail.appendChild(loss_input);
    detail.appendChild(line_break);
    detail.appendChild(gb_btn);
    detail.appendChild(gb_input);
    
    player_list.appendChild(divider);
  }
  if (player_num == 0) {
    let no_player_label = document.createElement("p");
    no_player_label.class = "content-header";
    no_player_label.textContent = "No players";
    player_list.appendChild(no_player_label);
  }
}

function populate_screen_public(player_data) {
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

function gen_table(player_info) {
  let wins = parseFloat(player_info.wins);
  let losses = parseFloat(player_info.losses);

  let win_p = wins / (wins + losses) * 100;
  var output = `
  <table>
    <tr>
      <th class="stat-label" ><b>Wins:</b></th>
      <th>${player_info.wins}</th>
    </tr>
    <tr>
      <th class="stat-label" ><b>Losses:</b></th>
      <th>${player_info.losses}</th>
    </tr>
    <tr>
      <th class="stat-label" ><b>Win %:</b></th>
      <th>${win_p.toPrecision(4)}%</th>
    </tr>
    <tr>
      <th class="stat-label" ><b>GBs:</b></th>
      <th>${player_info.gb}</th>
    </tr>
  </table>
        `;
  return output;
}

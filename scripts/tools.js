var sort_mode = 0;
var p_data = {};

function compare_player_wins(player1, player2) {
	return player2.wins - player1.wins;
}

function compare_player_names(player1, player2) {
	if (player1.name <= player2.name)
		return -1;
	else
		return 1;
}

function compare_player_number(player1, player2) {
	return player1.number - player2.number;
}

function compare_player_percentages(player1, player2) {
	let percent1 = player1.wins / (player1.wins + player1.losses);
	let percent2 = player2.wins / (player2.wins + player2.losses);

	return percent2 - percent1;
}

function change_sort_mode(new_mode) {
	sort_mode = new_mode;

	let page_content = document.getElementById("page-content");
	page_content.innerHTML = "";
	
	populate_screen_public(p_data);
	return sort_mode;
}

function get_sort_item_name(index) {
	switch (index) {
		case 0: return "Name";
		case 1: return "Jersey #";
		case 2: return "Win %";
		case 3: return "Total Wins";
	}
	return "Name";
}

function set_sort_item_classes(item, index) {
	if (sort_mode == index) {
		item.className = "sort-item active";
		item.innerText = "☰ " + get_sort_item_name(index);
	}
	else {
		item.className = "sort-item";
		item.innerText = get_sort_item_name(index);
	}	
}

//let sort_items = document.getElementsByClassName("sort-item");
//for (let i = 0; i < p_data.count; i++) 
//	set_sort_item_classes(sort_items[i], i);

function get_sorted_data(player_data) {
	let sort_items = document.getElementsByClassName("sort-item");
	for (let i = 0; i < sort_items.length; i++) 
    	set_sort_item_classes(sort_items[i], i);

	var sort_func;
	switch(sort_mode) {
		case 0: sort_func = compare_player_names; break;
		case 1: sort_func = compare_player_number; break;
		case 2: sort_func = compare_player_percentages; break;
		case 3: sort_func = compare_player_wins; break;
	}
	return player_data.players.sort(sort_func);
}


function set_unit_stats(wins, losses) {
	let total_percent = (wins + losses) > 0 ? wins / (wins + losses) * 100 : 0;
	let unit_label = document.getElementById("unit_stats");
	unit_label.innerHTML = `Unit: ${wins}/${(wins + losses)} = ${total_percent.toPrecision(4)}%`;
}

function populate_screen_dashboard(player_data) {
  var total_wins = 0;
  var total_losses = 0;

  p_data = player_data;
  let player_num = player_data.count;
  let players_sorted = get_sorted_data(player_data);
  for (let i = 0; i < player_num; i++) {
    let player_card = document.createElement("div");
    player_card.className = "content-body player-card";
    let curr_player = players_sorted[i];

    let wins = parseFloat(curr_player.wins);
    let losses = parseFloat(curr_player.losses);
    let win_p = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

	total_wins += wins;
	total_losses += losses;

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
    win_input.value = 1;

    let loss_btn = document.createElement("a");
    loss_btn.className = "stat-button button1";
    let loss_input = document.createElement("input");
    loss_input.type = "number";
    loss_input.className = "stat-input";
    loss_input.id = "loss_input_" + curr_player.number;
    loss_input.value = 1;
	
    let gb_btn = document.createElement("a");
    gb_btn.className = "stat-button button1";
    let gb_input = document.createElement("input");
    gb_input.type = "number";
    gb_input.className = "stat-input";
    gb_input.id = "gb_input_" + curr_player.number;
    gb_input.value = 1;


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
  set_unit_stats(total_wins, total_losses);
}

function populate_screen_public(player_data) {
  var total_wins = 0;
  var total_losses = 0;

  p_data = player_data;
  let player_list = document.getElementById("page-content");
  let player_num = player_data.count;
  let players_sorted = get_sorted_data(player_data);
  for (let i = 0; i < player_num; i++) {
    let player_card = document.createElement("div");
    player_card.className = "content-body player-card";
    let curr_player = players_sorted[i];

    let wins = parseFloat(curr_player.wins);
    let losses = parseFloat(curr_player.losses);
    let win_p = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

	total_wins += wins;
	total_losses += losses;

    let label = document.createElement("p");
    let detail = document.createElement("p");
    detail.className = "detail";

    let label_data = curr_player.name + "  #" + curr_player.number.toString();
    let data = gen_table(curr_player);
    /*
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
  set_unit_stats(total_wins, total_losses);
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

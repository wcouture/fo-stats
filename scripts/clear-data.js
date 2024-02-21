let submit_button = document.getElementById("submit-button");
submit_button.onclick = submit;

function submit() {
  let form_data = document.forms[0];
  let data = {};
  data.choice = form_data["confirm"].value;
  data.typed = form_data["type-confirm"].value;

  let form_element = document.getElementById("confirm-form");
  form_element.remove();
  
  let label = document.createElement("p");
  label.id = "count-down-label";
  
  let container = document.getElementById("page-content");
  container.appendChild(label);

  var result = "Clearing data";
  if (data.choice != "yes" || data.typed != "delete")   
    result = "Failed to verify";
  else
    http_request("POST", "/wipe", {confirmed: true}, null);
	
  count_down(5, result);
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

function count_down(i, msg) {
  if (i == 0) {
    window.location.href = "/";
    return;
  }
  else {
    let label = document.getElementById("count-down-label");
    label.textContent = `${msg}, returning to home page in ${i}...`;
    setTimeout(() => count_down(i - 1, msg), 1000);	
  }
}

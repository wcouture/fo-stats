let submit = document.getElementById("submit-button");
submit.addEventListener("click", submit_and_redirect);

let URI = "/add-player";

async function submit_and_redirect() {
  let p_form = document.forms[0];

  let postData = {};
  postData.name = p_form[0].value;
  postData.number = p_form[1].value;

  console.log(JSON.stringify(postData));
  // http post request to server
  const response = await fetch(URI, {
    method: "POST",
    mode: "same-origin",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => response.json())
    .then((window.location.href = "/"));
}

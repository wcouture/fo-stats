let submit_button = document.getElementById("submit-button");
submit_button.onclick = submit;

function submit() {
 let form = document.forms[0];
 console.log(`${form["confirm"].value} ${form[2].value}`);
}
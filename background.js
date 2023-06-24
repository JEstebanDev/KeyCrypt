//Check if exit a value in local storage
function checkLocalStorage() {
  var value = localStorage.getItem("pattern");
  const formWelcome = document.getElementById("welcome");KeyField
  const formEncrypt = document.getElementById("result");
  const formKeyField = document.getElementById("KeyField");
  if (value == null) {
    console.log("first")
    formWelcome.style.display = "block";
    formEncrypt.style.display = "none";
    formKeyField.style.display = "none";
  } else {
    formWelcome.style.display = "none";
    formKeyField.style.display = "block";
    formEncrypt.style.display = "block";
  }
}
checkLocalStorage();

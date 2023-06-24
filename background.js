//Check if exit a value in local storage
function checkLocalStorage() {
  var value = localStorage.getItem("pattern");
  const formWelcome = document.getElementById("welcome");
  const formEncrypt = document.getElementById("KeyField");
  if (value == null) {
    formWelcome.style.display = "block";
    formEncrypt.style.display = "none";
  } else {
    formEncrypt.style.display = "block";
    formWelcome.style.display = "none";
  }
}
checkLocalStorage();

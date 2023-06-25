//Check if exit a value in local storage
function checkLocalStorage() {
  try {
    var value = localStorage.getItem("pattern");
    const formWelcome = document.getElementById("welcome");
    const formEncrypt = document.getElementById("KeyField");
    const formResult = document.getElementById("Result");
    if (value == null) {
      formWelcome.style.display = "block";
      formEncrypt.style.display = "none";
      formResult.style.display = "none";
    } else {
      formEncrypt.style.display = "block";
      formResult.style.display = "none";
      formWelcome.style.display = "none";
      document.getElementsByTagName("html")[0].style.height="100px";
    }
  } catch (error) {
    console.log(error)
  }
 
}
checkLocalStorage();

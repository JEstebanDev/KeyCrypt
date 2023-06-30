// Attaching event listeners to the input fields
document.getElementById("generateKey").addEventListener("click", generateKey);
document.getElementById("checkKey").addEventListener("click", checkKeyFunction);
document.getElementById("copyPattern").addEventListener("click", copyPattern);
document
  .getElementById("copyEncrypted")
  .addEventListener("click", copyEncrypted);
document.getElementById("resetKey").addEventListener("click", resetKey);

//This function is to check if the user press enter in the input field of keyChecking to be more friendly
var input = document.getElementById("keyChecking");
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    checkKeyFunction();
    event.preventDefault();
  }
});

//This function basically delete the key from local storage
function resetKey() {
  Swal.fire({
    title:
      '<span style="font-size:18px; font-weight:500px;">Do you want to delete your key?</span>',
    width: 250,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("pattern");
      const formWelcome = document.getElementById("welcome");
      const formEncrypt = document.getElementById("KeyField");
      const formResult = document.getElementById("Result");
      formWelcome.style.display = "block";
      formEncrypt.style.display = "none";
      formResult.style.display = "none";
    }
  });
}

//This function is to copy the patternPassword to the clipboard
function copyPattern() {
  var inputElement = document.getElementById("patternPassword");
  inputElement.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

//This function is to copy the passwordSuggestedEncrypted to the clipboard
function copyEncrypted() {
  var inputElement = document.getElementById("passwordSuggestedEncrypted");
  inputElement.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

//This function is to check if the key is correct and show the patternPassword and passwordSuggestedEncrypted
function checkKeyFunction() {
  const decrypted = decryptData(
    localStorage.getItem("pattern"),
    document.getElementById("keyChecking").value
  );
  if (decrypted !== "") {
    //Show the block where is input for patternPassword and passwordSuggestedEncrypted
    const formResult = document.getElementById("Result");
    formResult.style.display = "block";

    const passwordPlainText = decrypted.replace("LINK", urlWeb);
    const passwordEncrypted = encryptData(
      passwordPlainText,
      document.getElementById("keyChecking").value
    );
    //Set the value in the input field
    document.getElementById("patternPassword").value = passwordPlainText;
    document.getElementById("passwordSuggestedEncrypted").value =
      passwordEncrypted;
  } else {
    //Show the error message
    Swal.fire({
      width: 250,
      title:
        '<span style="font-size:18px; font-weight:500px;">Check your key!</span>',
      icon: "error",
    });
    const formResult = document.getElementById("Result");
    formResult.style.display = "none";
  }
}

//This is the object where is the style of the password
const passwordStyle = {
  url: {
    position: 0,
    value: "LINK",
  },
  name: {
    position: 0,
    value: "",
  },
  yearBirth: {
    position: 1,
    value: 0,
  },
  favoriteColor: {
    position: 2,
    value: "",
  },
  randomCharacters: {
    position: 3,
    value: "",
  },
};

//This function is to generate the key is the MOST important function
function generateKey() {
  const { key, firstThreeWordsName, yearBirth, firstTwoWordsColor } =
    validateFields();
  // Get the key and value
  const lastTwoDigits = yearBirth % 100;

  const randomCharacters = generateRandomSpecialCharacters();
  // Set the value in the input field
  passwordStyle.name.value = firstThreeWordsName;
  passwordStyle.yearBirth.value = lastTwoDigits;
  passwordStyle.favoriteColor.value = firstTwoWordsColor;
  passwordStyle.randomCharacters.value = randomCharacters;
  console.log(passwordStyle);
  // Generate the password randomly and set the values inside the object {} passwordStyle
  const shuffledPassword = randomizeData(passwordStyle);
  //This functions takes the values and set as string
  const output = generateStringFromPosition(shuffledPassword) + "0";
  // Set the value in the input field
  document.getElementById("generatedPassword").value = output;
  //Save the key in the LocalStorage and show the block where is input for patternPassword and passwordSuggestedEncrypted
  document.getElementById("saveKey").addEventListener("click", () => {
    Swal.fire("Saved!", "", "success");
    const encryptPassword = encryptData(output, key);
    localStorage.setItem("pattern", encryptPassword);
    const formWelcome = document.getElementById("welcome");
    const formEncrypt = document.getElementById("KeyField");
    const formResult = document.getElementById("Result");
    formWelcome.style.display = "none";
    formEncrypt.style.display = "block";
    formResult.style.display = "none";
    //Reset the input fields
    resetFields();
    //Reset the height of the popup
    document.getElementsByTagName("html")[0].style.height = "100px";
  });
}
//This function is to reset the input fields
function resetFields() {
  document.getElementById("keyChecking").value = "";
  document.getElementById("key").value = "";
  document.getElementById("name").value = "";
  document.getElementById("yearBirth").value = "";
  document.getElementById("favoriteColor").value = "";
  document.getElementById("generatedPassword").value = "";
}

//This function is to validate the input fields
function validateFields() {
  const key = document.getElementById("key").value.split(" ").join("");
  const name = document.getElementById("name").value.split(" ").join("");
  const yearBirth = document.getElementById("yearBirth").value;
  const favoriteColor = document
    .getElementById("favoriteColor")
    .value.split(" ")
    .join("");

  // Check if all the fields are filled
  if (!key || !name || !yearBirth || !favoriteColor) {
    Swal.fire({
      width: 200,
      icon: "error",
      html: '<span style="font-size:14px">Please fill in all the required fields.</span>',
    });
    return;
  }

  if (key == " " || name == " " || favoriteColor == " ") {
    Swal.fire({
      width: 200,
      icon: "error",
      html: '<span style="font-size:14px">Please fill in all the required fields.</span>',
    });
    return;
  }

  if (!key || !name || !yearBirth || !favoriteColor) {
    Swal.fire({
      width: 200,
      icon: "error",
      html: '<span style="font-size:14px">Please fill in all the required fields.</span>',
    });
    return;
  }

  // Check if the year of birth is 4 digits
  if (yearBirth.length !== 4) {
    Swal.fire({
      width: 200,
      icon: "error",
      text: "Year of birth should be 4 digits",
    });
    return;
  }
  let firstThreeWordsName = extractFirstThreeWords(name);
  //Check if the year of birth is a number less than 2 digits
  const uppercaseColor = extractConsonantsFromUrl(favoriteColor);
  const firstTwoWordsColor = extractFirstTwoWords(uppercaseColor).toUpperCase();
  return {
    key,
    firstThreeWordsName,
    yearBirth,
    firstTwoWordsColor,
  };
}

//This function is to get the current tab URL
function getCurrentTabURL() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (tabs && tabs.length > 0) {
        resolve(tabs[0].url);
      } else {
        reject(new Error("No active tab found."));
      }
    });
  });
}

let urlWeb;
try {
  urlWeb = await getCurrentTabURL();
  urlWeb = extractWordFromUrl(urlWeb);
} catch (error) {
  console.error("Error url:", error);
}

//This function is to extract the first four consonants from the URL
function extractWordFromUrl(url) {
  console.log(url);

  const parts = url.split("/");
  let domain = parts[2];

  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  //This function is to extract the first four consonants from the URL
  return extractFirstFourWords(extractConsonantsFromUrl(domain));
}
//This function is to extract the first four consonants from the URL
function extractConsonantsFromUrl(domain) {
  return domain.match(/[bcdfghjklmnpqrstvwxyz]/gi).join("");
}

//This function is to generate the password style randomly
function generateStringFromPosition(data) {
  const sortedKeys = Object.keys(data).sort(
    (a, b) => data[a].position - data[b].position
  );
  let result = "";
  sortedKeys.forEach((key) => {
    result += data[key].value.toString();
  });

  return result;
}

//This function is to randomize the password style for the position of the object passwordStyle{}
function randomizeData(data) {
  const keys = Object.keys(data);
  const shuffledData = {};
  keys.forEach((key) => {
    shuffledData[key] = { ...data[key] };
  });

  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledData[keys[i]].position, shuffledData[keys[j]].position] = [
      shuffledData[keys[j]].position,
      shuffledData[keys[i]].position,
    ];
  }
  return shuffledData;
}

function extractFirstFourWords(name) {
  const words = name.split(" ");
  return words[0].slice(0, 4).toLowerCase();
}
function extractFirstThreeWords(name) {
  const words = name.split(" ");
  return words[0].slice(0, 3).toLowerCase();
}
function extractFirstTwoWords(name) {
  const words = name.split(" ");
  return words[0].slice(0, 2).toLowerCase();
}
//This function is to generate the random special characters
function generateRandomSpecialCharacters() {
  const specialCharacters = "!@#$%&*()-_=+[]{}<>,.?/";
  let result = "";
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * specialCharacters.length);
    const randomCharacter = specialCharacters.charAt(randomIndex);
    result += randomCharacter;
  }
  return result;
}

//This function is to encrypt and decrypt the data using CryptoJS
function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  const encoded = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encrypted)
  );
  return encoded;
}

//This function is to encrypt and decrypt the data using CryptoJS
function decryptData(encryptedData, key) {
  const decoded = CryptoJS.enc.Base64.parse(encryptedData).toString(
    CryptoJS.enc.Utf8
  );
  const decrypted = CryptoJS.AES.decrypt(decoded, key).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
}

// Attaching event listeners to the input fields
document.getElementById("generateKey").addEventListener("click", generateKey);
document.getElementById("checkKey").addEventListener("click", checkKeyFunction);
const yearBirthInput = document.getElementById("yearBirth");

yearBirthInput.addEventListener("input", function () {
  const yearBirthError = document.getElementById("yearBirthError");
  const yearBirth = yearBirthInput.value;
  if (yearBirth.length !== 4) {
    yearBirthError.textContent = "Year of birth should be 4 digits.";
  } else {
    yearBirthError.textContent = "";
  }
});

function checkKeyFunction() {
  const decrypted = decryptData(
    localStorage.getItem("pattern"),
    document.getElementById("keyChecking").value
  );
  if (decrypted !== "") {
    const passwordPlainText = decrypted.replace("LINK", urlWeb);
    const passwordEncrypted = encryptData(
      passwordPlainText,
      document.getElementById("keyChecking").value
    );
    const passwordSuggested = document.getElementById("passwordSuggested");
    const passwordSuggestedEncrypted = document.getElementById(
      "passwordSuggestedEncrypted"
    );
    passwordSuggested.textContent = passwordPlainText;
    passwordSuggestedEncrypted.textContent = passwordEncrypted;
  } else {
    passwordSuggested.textContent = "ERROR";
  }
}

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

function generateKey() {
  const { key, firstFourWordsName, yearBirth, firstFourWordsColor } =
    validateFields();
  // Get the key and value
  const lastTwoDigits = yearBirth % 100;
  const uppercaseColor = extractConsonantsFromUrl(
    firstFourWordsColor.toUpperCase()
  );
  const randomCharacters = generateRandomSpecialCharacters();

  passwordStyle.name.value = firstFourWordsName;
  passwordStyle.yearBirth.value = lastTwoDigits;
  passwordStyle.favoriteColor.value = uppercaseColor;
  passwordStyle.randomCharacters.value = randomCharacters;

  const shuffledPassword = randomizeData(passwordStyle);
  const output = generateStringFromPosition(shuffledPassword) + "0";

  document.getElementById("generatedPassword").value = output;

  document.getElementById("saveKey").addEventListener("click", () => {
    const encryptPassword = encryptData(output, key);
    localStorage.setItem("pattern", encryptPassword);
    const formWelcome = document.getElementById("welcome");
    const formEncrypt = document.getElementById("result");

    formWelcome.style.display = "none";
    formEncrypt.style.display = "block";
    yearBirthError.textContent;
    const passwordSuggested = document.getElementById("passwordSuggested");
    passwordSuggested.textContent = output;
  });
}

function validateFields() {
  const key = document.getElementById("key").value;
  const name = document.getElementById("name").value;
  const yearBirth = document.getElementById("yearBirth").value;
  const favoriteColor = document.getElementById("favoriteColor").value;

  if (!key || !name || !yearBirth || !favoriteColor) {
    Swal.fire({
      title: "Error!",
      text: "Please fill in all the required fields.",
      icon: "error",
    });
    return;
  }

  if (yearBirth.length !== 4) {
    Swal.fire({
      title: "Error!",
      text: "Year of birth should be 4 digits",
      icon: "error",
    });
    return;
  }

  let firstFourWordsName = "";
  if (name.length <= 4) {
    firstFourWordsName = name;
  } else {
    firstFourWordsName = extractFirstFourWords(name);
  }

  let firstFourWordsColor = "";
  if (favoriteColor.length <= 5) {
    firstFourWordsColor = favoriteColor;
  } else {
    firstFourWordsColor = extractFirstFourWords(favoriteColor);
  }

  return {
    key,
    firstFourWordsName,
    yearBirth,
    firstFourWordsColor,
  };
}

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
  console.error("Error:", error);
}

function extractWordFromUrl(url) {
  const parts = url.split("/");
  let domain = parts[2];

  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }
  return extractConsonantsFromUrl(domain);
}

function extractConsonantsFromUrl(domain) {
  return domain.match(/[bcdfghjklmnpqrstvwxyz]/gi).join("");
}

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

function encryptData(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  const encoded = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encrypted)
  );
  return encoded;
}

function decryptData(encryptedData, key) {
  const decoded = CryptoJS.enc.Base64.parse(encryptedData).toString(
    CryptoJS.enc.Utf8
  );
  const decrypted = CryptoJS.AES.decrypt(decoded, key).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
}


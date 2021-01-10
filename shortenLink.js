const resultContainer = document.getElementById("result"),
  searchBtn = document.getElementById("search-btn"),
  inputBox = document.querySelector(".search-box-container"),
  inputElement = document.getElementById("search-box");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  var originURL = inputElement.value;

  if (!originURL) {
    inputBox.classList.add("alert");
    inputElement.classList.add("alert");
  } else {
    shortenURL(originURL).then((shortenURL) => {
      renderHTML(resultContainer, originURL, shortenURL);

      const id = new Date().getTime().toString();
      addToLocalStorage(id, originURL, shortenURL);
    });
  }
});

inputElement.addEventListener("focus", (e) => {
  if (e.target.classList.contains("alert")) {
    inputBox.classList.remove("alert");
    inputElement.classList.remove("alert");
  }
});

window.addEventListener("DOMContentLoaded", setupItems);

const shortenURL = (originURL) => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.shrtco.de/v2/shorten", {
        params: {
          url: originURL,
        },
      })
      .then(function (response) {
        resolve(response.data.result.full_short_link);
      })
      .catch(function (error) {
        showErrorMsg();
        reject(error);
      });
  });
};

const renderHTML = ($resultContainer, originURL, shortenURL) => {
  const searchResultBox = document.createElement("div");

  searchResultBox.classList.add("search-result-box");
  searchResultBox.innerHTML = `
                              <p class="originURL">${originURL}</p>
                              <div class="result-data-box">
                                <p class="shortenLink">${shortenURL}</p>
                                <button class="btn copy-btn">copy</button>
                              </div>`;

  if ($resultContainer.childNodes.length >= 3) {
    $resultContainer.removeChild($resultContainer.lastChild);
  }

  if ($resultContainer.firstChild) {
    $resultContainer.insertBefore(searchResultBox, $resultContainer.firstChild);
  } else {
    $resultContainer.appendChild(searchResultBox);
  }

  const copyBtn = searchResultBox.querySelector(".btn.copy-btn");
  copyBtn.addEventListener("click", (e) => {
    /* check permission */
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        updateClipboard(shortenURL);
        copyBtn.textContent = "copied!";
        copyBtn.classList.add("active");
      } else {
        console.error("no permission");
      }
    });
  });
};

const showErrorMsg = () => {
  inputBox.classList.add("error");
  setTimeout(() => {
    inputBox.classList.remove("error");
  }, 1000);
};

const updateClipboard = (newClip) => {
  navigator.clipboard.writeText(newClip).then(
    () => {
      /* clipboard successfully set */
      console.log("copy success");
    },
    () => {
      /* clipboard write failed */
      console.error("copy failed");
    }
  );
};

// ******* LOCAL STORAGE ***********
function addToLocalStorage(id, originURl, shortenURL) {
  const url = { id, value: [originURl, shortenURL] };
  let items = getLocalStorage();
  console.log(items);
  if (items.length >= 3) {
    items.shift();
  }
  items.push(url);
  localStorage.setItem("url", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("url", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("url")
    ? JSON.parse(localStorage.getItem("url"))
    : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      renderHTML(resultContainer, item.value[0], item.value[1]);
    });
  }
}

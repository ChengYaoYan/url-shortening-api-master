const shortenURL = (url) => {
  axios
    .get("https://api.shrtco.de/v2/shorten", {
      params: {
        url,
      },
    })
    .then(function (response) {
      console.log(response.data.result.full_short_link);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchBoxContainer = document.querySelector(".search-box-container");
  const searchBox = document.getElementById("search-box");
  var searchURL = searchBox.value;
  console.log(searchURL);

  if (!searchURL) {
    searchBoxContainer.classList.add("alert");
    searchBox.classList.add("alert");
  } else {
    shortenURL(searchURL);
  }
});

const target = document.getElementById('hashtag');

// fetch the first hashtag
fetchHashtag();
// update it every 3 seconds
setInterval(fetchHashtag, 3000);

/**
 * Fetch a hashtag from the api
 */
function fetchHashtag() {
  fetch("/api/hashtag/")
    // convert the response to json
    .then((res) => res.json())
    .then((data) => {
      target.innerHTML = data;
    })
    .catch(() => {
      console.log("API unreachable");
    });
}
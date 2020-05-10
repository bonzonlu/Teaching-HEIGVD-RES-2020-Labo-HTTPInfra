const target = document.getElementById('hashtag');

fetch("/api/hashtag/")
  // convert the response to json
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    target.innerHTML = data;
  })
  .catch(() => {
    console.log("API unreachable");
  });

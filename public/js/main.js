window.onload = () => {
  buttonDeleteSkip = document.getElementById('button');
  buttonDeleteSkip.addEventListener('click', deleteSkip);
}

function deleteSkip() {
  var request = new XMLHttpRequest();
  request.open('GET', '/spotify/api/deleteskip');
  request.onerror = function () {
    console.log('Connection error to /deleteskip');
  };
  request.send();
};

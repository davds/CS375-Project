$("#header").load("header.html");

fetch("/user").then(res => {
  return res.json();
}).then(data => {
    if (data.loggedIn) {
        $("#header-login").text("Logout");
        $("#header-login-action").attr("action", "/logout");
    }
});

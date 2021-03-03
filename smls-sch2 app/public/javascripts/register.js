let passwordEl = document.getElementById("password");
let rpasswordEl = document.getElementById("rpassword");

let passwordErrorEl = document.getElementById("passwordError");
let rpasswordErrorEl = document.getElementById("rpasswordError");

let loginEl = document.getElementById("login");
let loginElError = document.getElementById("loginError");

let nameEl = document.getElementById("name");
let nameElError = document.getElementById("nameError");

function checkPasswords() {
    let password = passwordEl.value;
    let rpassword = rpasswordEl.value;
    if (password != rpassword) {
        passwordEl.classList.add("is-invalid");
        rpasswordEl.classList.add("is-invalid");
        passwordErrorEl.innerText = "Passwords do not match"
        rpasswordErrorEl.innerText = "Passwords do not match"
        rpasswordEl.setCustomValidity("Passwords do not match");
        passwordEl.setCustomValidity("Passwords do not match");
    } else {
        passwordEl.classList.remove("is-invalid");
        rpasswordEl.classList.remove("is-invalid");
        rpasswordEl.setCustomValidity("");
        passwordEl.setCustomValidity("");
        passwordErrorEl.innerText = ""
        rpasswordErrorEl.innerText = ""

    }
    if (passwordEl.value.length < 6) {
        passwordEl.classList.add("is-invalid");
        passwordErrorEl.innerText = "Password is too short"
        passwordEl.setCustomValidity("Passwords is too short");

    }
    else{
        passwordEl.classList.remove("is-invalid");
        passwordEl.setCustomValidity("");
        passwordErrorEl.innerText = ""
    }
}

function checkLogin() {
    if (loginEl.value.length === 0) {
      loginEl.classList.add("is-invalid");
      loginElError.innerText = "Enter your login";
      loginEl.setCustomValidity("No Login");
    } else {
      loginElError.innerText = "";
      fetch(`/auth/checkLogin?login=${loginEl.value}`)
        .then(x => x.json())
        .then(res => {
            console.log("i`m there")
          if (res === true) {
            loginEl.classList.add("is-invalid");
            loginElError.innerText = "Login already exist";
            loginEl.setCustomValidity("Login exist");
          } else {
            loginElError.innerText = "";
            loginEl.classList.remove("is-invalid");
            loginEl.setCustomValidity("");
          }
        });
    }
  }
  function checkName() {
    if (nameEl.value.length === 0) {
      nameEl.classList.add("is-invalid");
      nameElError.innerText = "Enter your name";
      nameEl.setCustomValidity("No Name");
    } else {
      nameElError.innerText = "";
      nameEl.classList.remove("is-invalid");
      nameEl.setCustomValidity("");
    }
  }

  function onSubmit() {
    checkLogin();
    checkPasswords();
    checkName();
    

}

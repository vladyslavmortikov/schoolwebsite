const loginElement = document.getElementById("login");
let loginElementError = document.getElementById("loginError");

let passwordElement = document.getElementById("password");
let passwordElementError = document.getElementById("passwordError");

const loginFormEl = document.getElementById('login-form');

function checkLogin() {
  if (loginElement.value.length === 0) {
    loginElement.classList.add("is-invalid");
    loginElementError.innerText = "Enter your login";
    loginElement.setCustomValidity("Passwords do not match");
  } else {
    loginElementError.innerText = "";
    fetch(`/auth/checkLogin?login=${loginElement.value}`)
      .then(x => x.json())
      .then(res => {
        if (res === false) {
          loginElement.classList.add("is-invalid");
          loginElementError.innerText = "Login doesn`t exist";
          loginElement.setCustomValidity("Login doesn`t exist");
        } else {
          loginElementError.innerText = "";
          loginElement.classList.remove("is-invalid");
          loginElement.setCustomValidity("");
        }
      });
  }
}

function checkPassword() {
  
  let login = loginElement.value;
  let password = passwordElement.value;
  if (passwordElement.value.length == 0) {
    passwordElement.classList.add("is-invalid");
    passwordElementError.innerText = "Enter your password";
    passwordElement.setCustomValidity("Enter your password");
  } else {
    passwordElementError.innerText = "";
    fetch(`/auth/checkLoginAndPassword?login=${login}&password=${password}`)
      .then(x => x.json())
      .then(res => {
        if (res === false) {
          passwordElement.classList.add("is-invalid");
          passwordElementError.innerText = "Wrong password";
          passwordElement.setCustomValidity("Wrong password");
        } else {
          
          passwordElementError.innerText = "";
          passwordElement.classList.remove("is-invalid");
          passwordElement.setCustomValidity("");
        }
        
      });
  }
}
function CheckError()
{
    if(passwordElementError.value != undefined || passwordElementError.value!= null || passwordElementError.value!= "")
    if(loginElementError.value != undefined || loginElementError.value!= null || passwordElementError.value!= "")
    return false
    else
    return true
}



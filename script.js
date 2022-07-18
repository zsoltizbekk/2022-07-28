const email = document.querySelector("#e-mail");
const pwd = document.querySelector("#passwd");
const submit = document.querySelector("#sign-up");
const pwdHideShow = document.querySelector(".pwd-show-hide");
const eye = document.querySelector(".eye");
const valid = document.querySelector(".validation");
const dot = document.querySelector("#dot");
const checkbox = document.querySelector(".checkbox");

const pwd1 = document.querySelector("#pwd-1");
const pwd2 = document.querySelector("#pwd-2");
const pwd3 = document.querySelector("#pwd-3");
const pwd4 = document.querySelector("#pwd-4");

//if the local storage has an email and/or a password it automatically fills the input field
if (localStorage.getItem("email") !== null) {
  email.value = JSON.parse(localStorage.getItem("email"));
}
if (localStorage.getItem("pwd") !== null) {
  pwd.value = JSON.parse(localStorage.getItem("pwd"));
}

//Sign up button
valid.addEventListener("submit", function (event) {
  event.preventDefault();
  validation(email.value, pwd.value);
});

//Password hide / show button
pwdHideShow.addEventListener("click", function () {
  let pwdInput = document.querySelector("#passwd");
  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    eye.innerHTML = `
        <source srcset="./assets/fa-eye-slash@2x.png 2x, ./fa-eye-slash@3x.png 3x">
        <img src="./assets/fa-eye-slash.png" alt="logo">`;
  } else {
    pwdInput.type = "password";
    eye.innerHTML = `<source srcset="./assets/fa-eye@2x.png 2x, ./fa-eye@3x.png 3x">
    <img src="./assets/fa-eye.png" alt="logo">`;
  }
});

//send the data in the input field for authentication
async function validation(emailValue, pwdValue) {
  try {
    let response = await fetch(
      "https://us-central1-ria-server-b1103.cloudfunctions.net/authenticate",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "application/json",
        },
        body: JSON.stringify({
          data: {
            email: emailValue,
            password: pwdValue,
          },
        }),
      }
    );
    const res = await response.json();
    if (res.result.hasOwnProperty("error")) {
      console.log(res.result.error);
      if (res.result.error === "Invalid password") {
        pwd.className = "pwdError";
      } else if (res.result.error === "Invalid e-mail") {
        email.className = "emailError";
      } else {
        email.className = "emailError";
        pwd.className = "pwdError";
      }
    } else {
      display(res);
      console.log(res);
    }
  } catch (error) {
    console.trace(error);
  }
}

//remove email field error color
email.addEventListener("input", function () {
  email.classList.remove("emailError");
});

//Password strength indicator
/* 
for the green strength indicator it:
- must be longer than 5 character
- must contain at least 1 lowercase character
- must contain at least 1 uppercase character
- must contain at least 1 number
*/
pwd.addEventListener("input", function () {
  pwd.classList.remove("pwdError");
  console.log(this.value);
  let counter = 0;
  let lowercase = false;
  let uppercase = false;
  let num = false;
  for (let i = 0; i < this.value.length; i++) {
    if (this.value[i] < 10 && this.value[i] >= 0) {
      num = true;
    } else if (this.value[i].toLowerCase() == this.value[i]) {
      lowercase = true;
    } else if (this.value[i].toUpperCase() == this.value[i]) {
      uppercase = true;
    }
  }
  if (num === true) {
    counter++;
  }
  if (lowercase === true) {
    counter++;
  }
  if (uppercase === true) {
    counter++;
  }
  if (this.value.length > 5) {
    counter++;
  }

  switch (counter) {
    case 1:
      {
        pwd1.style.color = "#cd4146";
        pwd2.style.color = "#a1a1a1";
        pwd3.style.color = "#a1a1a1";
        pwd4.style.color = "#a1a1a1";
      }
      break;
    case 2:
      {
        pwd1.style.color = "#cd4146";
        pwd2.style.color = "#f9c466";
        pwd3.style.color = "#a1a1a1";
        pwd4.style.color = "#a1a1a1";
      }
      break;
    case 3:
      {
        pwd1.style.color = "#cd4146";
        pwd2.style.color = "#f9c466";
        pwd3.style.color = "#f9c466";
        pwd4.style.color = "#a1a1a1";
      }
      break;
    case 4:
      {
        pwd1.style.color = "#cd4146";
        pwd2.style.color = "#f9c466";
        pwd3.style.color = "#f9c466";
        pwd4.style.color = "#0a96a3";
      }
      break;
    default:
      {
        pwd1.style.color = "#a1a1a1";
        pwd2.style.color = "#a1a1a1";
        pwd3.style.color = "#a1a1a1";
        pwd4.style.color = "#a1a1a1";
      }
      break;
  }
});

//display the user at successfull login
function display(res) {
  //if the checkbox is checked, save the login information in local storage
  if (checkbox.checked) {
    localStorage.setItem("email", JSON.stringify(email.value));
    localStorage.setItem("pwd", JSON.stringify(pwd.value));
  }

  const modal = document.querySelector(".modal");
  const closeBtn = document.querySelector(".close");
  const modalContent = document.querySelector(".modal-content");

  modal.style.display = "block";
  modalContent.innerHTML = `<h1>Welcome ${res.result.name}!</h1></br>
    <h6>e-mail: ${res.result.email}</h6></br>
    <h6>address: ${res.result.address}</h6></br>
    <h6>id: ${res.result.id}</h6>`;

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

//checkbox
dot.addEventListener("click", function () {
  if (checkbox.checked) {
    dot.style.backgroundColor = "#a1a1a1";
    checkbox.checked = false;
    console.log(checkbox.checked);
  } else {
    dot.style.backgroundColor = "#4a90e2";
    checkbox.checked = true;
    console.log(checkbox.checked);
  }
});

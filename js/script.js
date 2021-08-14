//fake Data:

const fakeData = [
  {
    owner: "Jonas Schmedtmann",
    movements: [
      200,  -400, 3000, -650, 70, 1300,
    ],
    pin: 1111,
  },
  {
    owner: "Jessica Davis",
    movements: [5000, 3000, -1000, -1000, 8000],
    pin: 2222,
  },
  {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    pin: 3333,
  },
  {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    pin: 4444,
  },
];

//get DOM Element:
let loadPage = document.querySelector(".load-box");
let loginBox = document.querySelector(".login-box");
let bankBox = document.querySelector(".bank-box");

//element of form login
let txtUser = document.querySelector("#user");
let txtPin = document.querySelector("#pin");
let errMessage = document.querySelector(".errMessage");

let btnLogin = document.querySelector("input[type='button']");

//element of form bank
let userName = document.querySelector(".user-name");
let date = document.querySelector(".date");
let balanceValue = document.querySelector(".balance__value");
let movements = document.querySelector(".movements");
let valueIn = document.querySelector(".summary__value--in");
let valueOut = document.querySelector(".summary__value--out");


let txtTransferTo = document.querySelector(".form__input--to");
let txtTransferAmout = document.querySelector(".form__input--amount");
let txtLoanAmout = document.querySelector(".form__input--loan-amount");

let btnLogout = document.querySelector(".btn-logout");
let btnTransfer = document.querySelector(".form__btn--transfer");
let btnLoan = document.querySelector(".form__btn--loan");
let btnSort = document.querySelector(".btn--sort");

let isSortMovements = false;

//function:
//check user login
function CheckUserLogin(user = "", pin = "") {
  let check = false;
  let userIndex = 0;
  for (let i = 0; i < fakeData.length; i++) {
    let str = fakeData[i].owner
      .toLocaleLowerCase()
      .split(" ")
      .map((item) => item.charAt(0))
      .join("");
    if (user === str && fakeData[i].pin === Number(pin)) {
      check = true;
      userIndex = i;
    }
  }
  return [check, userIndex];
}
// Load data
function LoadData(userIndex) {
  let arrMovements;
  if (isSortMovements === false) {
    if (fakeData.length > userIndex && 0 <= userIndex) {
      arrMovements = fakeData[userIndex].movements.map((item) => {
        let type;
        item > 0 ? (type = "deposit") : (type = "withdrawal");
        return `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${type}
          </div>
          <div class="movements__date"></div>
          <div class="movements__value">${item} $</div>
        </div>`;
      });
    }
  } else {
    if (fakeData.length > userIndex && 0 <= userIndex) {
      let newArr = [...fakeData[userIndex].movements];
      arrMovements = newArr
        .sort(function (a, b) {
          return b - a;
        })
        .map((item) => {
          let type;
          item > 0 ? (type = "deposit") : (type = "withdrawal");
          return `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${type}
          </div>
          <div class="movements__date"></div>
          <div class="movements__value">${item} $</div>
        </div>`;
        });
    }
  }
  return arrMovements.join("");
}
//balance_value:
function SumBalance(userIndex) {
  let sum = 0;
  fakeData[userIndex].movements.forEach((element) => {
    sum += element;
  });
  return sum;
}
//find User by owner:
function findUser(name) {
  let userIndex;
  let userMovements;
  for (let i = 0; i < fakeData.length; i++) {
    if (name === fakeData[i].owner) {
      userIndex = i;
      userMovements = fakeData[i].movements;
    }
  }
  return [userIndex, userMovements];
}
//find User by userLogin:
function findUserByUserLogin(userLogin) {
  let userIndex;
  let userMovements;
  for (let i = 0; i < fakeData.length; i++) {
    let str = fakeData[i].owner
      .toLocaleLowerCase()
      .split(" ")
      .map((item) => item.charAt(0))
      .join("");
    if (userLogin === str) {
      userIndex = i;
      userMovements = fakeData[i].movements;
    }
  }
  return [userIndex, userMovements];
}
// sum in , sum out of owner
function SumSummary(name) {
  let [userIndex, userMovements] = findUser(name);
  let sumIn = 0;
  let sumOut = 0;
  userMovements.forEach((element) => {
    element > 0 ? (sumIn += element) : (sumOut += element);
  });
  return [sumIn, sumOut];
}

//push element to movements array:
function pushValue(name,value){
  let [userIndex, userMovements] = findUser(name);
  userMovements.push(value);
}

//DOM Event
// Click button login:
btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  let [check, index] = CheckUserLogin(
    txtUser.value.trim(),
    txtPin.value.trim()
  );
  let [sumIn, sumOut] = SumSummary(fakeData[index].owner);
  let datetime = new Date;
  if (txtUser.value.trim() == "") {
    errMessage.innerHTML = "User is required";
    txtUser.focus();
  } else if (txtPin.value.trim() == "") {
    errMessage.innerHTML = "Pin is required";
    txtPin.focus();
  } else if (check === false) {
    errMessage.innerHTML = "User or Pin invalid";
  } else if (check === true) {
    loadPage.style.display = "block";
    setTimeout(() => {
      loadPage.style.display = "none";
    }, 1800);
    setTimeout(() => {
      loginBox.style.display = "none";
      userName.innerHTML = fakeData[index].owner;
      date.innerHTML = `${datetime.toLocaleDateString()}`
      balanceValue.innerHTML = `${SumBalance(index)} $`;
      bankBox.style.display = "block";
      movements.innerHTML = LoadData(index);
      valueIn.innerHTML = `${sumIn} $`;
      valueOut.innerHTML = `${sumOut} $`;
    }, 1000);
  }
});

//Change Input:
txtUser.addEventListener("input", () => {
  errMessage.innerHTML = "";
});
txtPin.addEventListener("input", () => {
  errMessage.innerHTML = "";
});

//Logout:
btnLogout.addEventListener("click", () => {
  loginBox.style.display = "block";
  bankBox.style.display = "none";
  txtPin.value = "";
  txtUser.value = "";
});




//transfer:
btnTransfer.addEventListener("click", (event) => {
  event.preventDefault();
  if(txtTransferTo.value.trim() !=="" && Number(txtTransferAmout.value) > 0 ){
    let [userIndex, userMovements] = findUser(userName.textContent);
    let [receiverName, receiverMovements] = findUser(txtTransferTo.value.trim());
    if(SumBalance(userIndex) > (Number(txtTransferAmout.value) + 50)){

      if(receiverName){
        receiverMovements.push(Number(txtTransferAmout.value));
        userMovements.push(Number(-txtTransferAmout.value.trim()));
        let [sumIn, sumOut] = SumSummary(fakeData[userIndex].owner);
        if(isSortMovements === false){
          movements.insertAdjacentHTML("afterbegin",`
            <div class="movements__row">
              <div class="movements__type movements__type--withdrawal">
              withdrawal
              </div>
              <div class="movements__date"></div>
              <div class="movements__value">${Number("-" + txtTransferAmout.value)} $</div>
            </div>`
          );
          console.log("-" + txtTransferAmout.value);
        }
        else{
          movements.insertAdjacentHTML("beforeend",`
          <div class="movements__row">
            <div class="movements__type movements__type--withdrawal">
            withdrawal
            </div>
            <div class="movements__date"></div>
            <div class="movements__value">${Number("-" + txtTransferAmout.value)} $</div>
          </div>`
        );
  
        console.log("-" + txtTransferAmout.value);
        }
        balanceValue.innerHTML = `${SumBalance(userIndex)} $`;
        valueIn.innerHTML = "";
        valueOut.innerHTML = "";
        valueIn.innerHTML = `${sumIn} $`;
        valueOut.innerHTML = `${sumOut} $`;
      }
    }
    else{
      alert("Insufficient account balance");
    }
  }



});

//request loan
btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  if(Number(txtLoanAmout.value) > 0 ){
    if(confirm("You sure about that?")=== true){
      let [userIndex, userMovements] = findUser(userName.textContent);
      userMovements.push(Number(txtLoanAmout.value.trim()));
      let [sumIn, sumOut] = SumSummary(fakeData[userIndex].owner);
      movements.insertAdjacentHTML("afterbegin",`
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">
          deposit
          </div>
          <div class="movements__date"></div>
          <div class="movements__value">${Number(txtLoanAmout.value)} $</div>
        </div>`
      );
      balanceValue.innerHTML = `${SumBalance(userIndex)} $`;
      valueIn.innerHTML = "";
      valueOut.innerHTML = "";
      valueIn.innerHTML = `${sumIn} $`;
      valueOut.innerHTML = `${sumOut} $`;
    }
  }
});

//sort
btnSort.addEventListener("click", (event) => {
  event.preventDefault();
  isSortMovements = !isSortMovements;
  let [userIndex, userMovements] = findUser(userName.textContent);
  console.log(isSortMovements)
  movements.innerHTML = "";
  movements.innerHTML = LoadData(userIndex);
});

/**********************************/
// the modal
let ebModal = document.getElementById('mySizeChartModal');


let ebBtn = document.getElementById("mySizeChart");

let ebSpan = document.getElementsByClassName("ebcf_close")[0];

ebBtn.onclick = function() {
    ebModal.style.display = "block";
}

ebSpan.onclick = function() {
    ebModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == ebModal) {
        ebModal.style.display = "none";
    }
}
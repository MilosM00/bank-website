'use strict';

const account1 = {
  owner: `Zika Zikic`,
  movements: [3000, 5550.23, -406.5, 56000, -11742.21, -233.9, 179.97, 1400],
  interestRate: 1.1,
  pin: 1111,

  movementsDates: [
    `2021-11-15T21:31:17.178Z`,
    `2021-12-21T07:42:02.383Z`,
    `2021-01-23T09:15:04.904Z`,
    `2021-04-06T10:17:24.185Z`,
    `2021-05-09T14:11:59.604Z`,
    `2021-05-17T17:01:17.194Z`,
    `2021-03-14T23:36:17.929Z`,
    `2021-03-02T10:51:36.790Z`,
  ],
  currency: `RSD`,
  locale: `sr-SP`,
};

const account2 = {
  owner: `Carl Johnson`,
  movements: [7000.79, 5400.45, -550, -990, -4210, -1500, 9500.44, -80],
  interestRate: 1.2,
  pin: 2222,

  movementsDates: [
    `2020-11-05T13:15:33.035Z`,
    `2020-11-23T09:48:16.867Z`,
    `2020-12-21T06:04:23.907Z`,
    `2020-01-28T14:18:46.235Z`,
    `2020-02-07T16:33:06.386Z`,
    `2020-04-11T14:43:26.374Z`,
    `2020-06-18T18:49:59.371Z`,
    `2020-07-26T12:01:20.894Z`,
  ],
  currency: `USD`,
  locale: `en-US`,
};

const account3 = {
  owner: `Alexander Petrov`,
  movements: [9000.77, -1440, 355.11, 792.69, 3210, 1000, -5500, 50.20],
  interestRate: 1.3,
  pin: 3333,

  movementsDates: [
    `2021-11-04T13:15:33.035Z`,
    `2021-11-24T09:48:16.867Z`,
    `2021-12-21T06:04:23.907Z`,
    `2021-01-28T14:18:46.235Z`,
    `2021-02-13T16:33:06.386Z`,
    `2021-04-11T14:43:26.374Z`,
    `2021-06-22T18:49:59.371Z`,
    `2021-07-29T12:01:20.894Z`,
  ],
  currency: `RUB`,
  locale: `ru-RU`,
};

const account4 = {
  owner: `Shigeru Tanaka`,
  movements: [10222, 6470, -154, -1196, 3212, 1550, 8509, -3332],
  interestRate: 1.4,
  pin: 4444,

  movementsDates: [
    `2020-11-12T13:15:33.035Z`,
    `2020-11-19T09:48:16.867Z`,
    `2020-12-23T06:04:23.907Z`,
    `2020-01-29T14:18:46.235Z`,
    `2020-02-12T16:33:06.386Z`,
    `2020-04-27T14:43:26.374Z`,
    `2020-06-14T18:49:59.371Z`,
    `2020-07-11T12:01:20.894Z`,
  ],
  currency: `JPY`,
  locale: `ja-JP`,
};

const accounts = [account1, account2, account3, account4];


const labelWelcome = document.querySelector(`.welcome`);
const labelDate = document.querySelector(`.date`);
const labelBalance = document.querySelector(`.balance__value`);
const labelSumIn = document.querySelector(`.summary__value--in`);
const labelSumOut = document.querySelector(`.summary__value--out`);
const labelSumInterest = document.querySelector(`.summary__value--interest`);
const labelTimer = document.querySelector(`.timer`);

const containerApp = document.querySelector(`.app`);
const containerMovements = document.querySelector(`.movements`);

const buttonLogin = document.querySelector(`.login__btn`);
const buttonTransfer = document.querySelector(`.form__btn--transfer`);
const buttonLoan = document.querySelector(`.form__btn--loan`);
const buttonClose = document.querySelector(`.form__btn--close`);
const buttonSort = document.querySelector(`.btn--sort`);

const inputLoginUsername = document.querySelector(`.login__input--user`);
const inputLoginPin = document.querySelector(`.login__input--pin`);
const inputTransferTo = document.querySelector(`.form__input--to`);
const inputTransferAmount = document.querySelector(`.form__input--amount`);
const inputLoanAmount = document.querySelector(`.form__input--loan-amount`);
const inputCloseUsername = document.querySelector(`.form__input--user`);
const inputClosePin = document.querySelector(`.form__input--pin`);


const formatMovementDate = function(date, locale){
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  
  if(daysPassed === 0) return `Today`;
  if(daysPassed === 1) return `Yesterday`;
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else{
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCur = function(value, locale, currency){
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100).filter((int, i, arr) => {
      return int >= 1;
    }).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(` `).map(name => name[0]).join(``);
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};


let currentAccount, timer;


const startLogOutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
    
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;

  };

  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;

};

buttonLogin.addEventListener(`click`, function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(` `)[0]}`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: `numeric`,
      minute: `numeric`,
      day: `numeric`,
      month: `numeric`,
      year: `numeric`
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

buttonTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = ``;

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

buttonLoan.addEventListener(`click`, function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = ``;

  clearInterval(timer);
  timer = startLogOutTimer();
});

buttonClose.addEventListener(`click`, function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = ``;
});

let sorted = false;
buttonSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
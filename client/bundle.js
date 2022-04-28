(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const jwt_decode = require('jwt-decode');

// Checks whether the api is running from localhost or heroku and changes accordingly
// const url = window.location.hostname.includes('localhost')
//     ? 'http://localhost:3000'
//     : '(link for heroku)';

const url = 'http://localhost:3000';
const currUser = localStorage.getItem('username');

function currentUser() {
    const username = localStorage.getItem('username')
    return username;
}

async function requestLogin(e) {
    e.preventDefault();
    try {
        const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
		};
        const resp = await fetch(`${url}/login`, options);
        const data = await resp.json();
        if (data.err){ throw Error(data.err); }
        login(data);
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

async function requestRegistration(e) {
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        const resp = await fetch(`${url}/register`, options)
        const data = await resp.json()
        if (data.err){ throw Error(data.err) }
        requestLogin(e);
    } catch (err) {
        console.warn(err);
    }
}

async function userHabits() {
    try {
        const options = {
			headers: new Headers({ 'authorization': localStorage.getItem('token') })
		};
        const resp = await fetch(`${url}/habits/users/${currUser}`, options);
        const data = await resp.json();
        if (data.err){ throw Error(data.err); }
        return data;
    } catch (err) {
        console.warn(`Error: ${err}`);
    }
}

async function postHabit(e) {
	try {
		const options = {
			method: 'POST',
			headers: new Headers({
				Authorization: localStorage.getItem('token'),
				'Content-Type': 'application/json',
			}),
			body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
		};
		const resp = await fetch(`${url}/habits/users/${currUser}`, options);
		const data = await resp.json();
		if (data.err) {
			throw new Error(err);
		}
		return data;
	} catch (err) {
		console.warn(err);
	}
}

async function patchReps(habit_id) {
	try {
		const options = {
			method: 'PATCH',
			headers: new Headers({
				Authorization: localStorage.getItem('token'),
				// 'Content-Type': 'application/json',
			}),
			// body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
		};
		const resp = await fetch(`${url}/habits/${habit_id}`, options);
		const data = await resp.json();
		if (data.err) {
			throw new Error(err);
		}
		return data;
	} catch (err) {
		console.warn(err);
	}
}

async function deleteHabit(id) {
	try {
		const options = {
			method: 'DELETE',
			headers: new Headers({ Authorization: localStorage.getItem('token') }),
		};
		const response = await fetch(`${url}/habits/delete/${id}`, options);
		if (response.err) {
			throw Error(err);
		}
	} catch (err) {
		console.warn(err);
	}
}

function login(data){
    localStorage.setItem('token', data.token);
    const token = data.token.split(" ")[1];
    const payload = jwt_decode(token);
    localStorage.setItem('username', payload.username);
    // console.log(window.location.pathname);
    // console.log(window.location.href);
    window.location.replace("index.html");
    // window.location.pathname = '../index.html';
}

function logout(){
    console.log('working!')
    localStorage.clear();
    window.location.reload();
    window.location.replace('login.html');
}



module.exports = { requestLogin, requestRegistration, login, logout, userHabits, postHabit, patchReps, deleteHabit, currUser, currentUser}

},{"jwt-decode":4}],2:[function(require,module,exports){
const auth = require('./auth')

const login = document.querySelector('.login-box')
const register = document.querySelector('.register-btn');
const registerForm = document.querySelector('#register-form')
const loginForm = document.querySelector('#login-form');
const newAccount = document.querySelector('.register-page');
const closer = document.querySelector('.register-close');
const logOut = document.querySelector('#logout');
const username = document.getElementById('username');
const password = document.querySelector('.password');
const firstName = document.querySelector('#first-name');
const lastName = document.querySelector('#last-name');
const habit = document.querySelector('.habit');

if (register){
register.addEventListener('click', (e) => {
    e.preventDefault()
    newAccount.style.display = 'block';

})
};

if (closer){
closer.addEventListener('click', () => {
    newAccount.style.display = 'none';
})
};

if(loginForm){loginForm.addEventListener('submit', auth.requestLogin)};

if(registerForm){registerForm.addEventListener('submit', auth.requestRegistration)};

if(logOut){
    logOut.addEventListener('click', auth.logout);
    window.addEventListener('load', auth.userHabits);
};

},{"./auth":1}],3:[function(require,module,exports){
const auth = require('./auth');

const addHabits = document.querySelector('.add-habit'); //Selecting the form
const habitsList = document.querySelector('.habits')//Selecting the habit list
// const habits = JSON.parse(localStorage.getItem('habits')) || []; //where we will add the habit list to
const habitSubmit = document.querySelector('#submit');
// const countBtn = document.querySelectorAll('.count');
// const countBtn1 = document.querySelector('#count1');
const loadCheck = document.querySelector('.dashboard-page');
const userMsg = document.querySelector('#user-msg');

// const logOut = document.querySelector('log-out');

//Line 3 = Method on JSON that allows us to convert a string to JSON object that allows us to make habits an array of objects

//add habit
// function addHabit(e) {
//     e.preventDefault(); //Stops page from refreshing
//     //Adding Habit, counts and frequency to the function
//     const text = this.querySelector("[name=habit]").value;
//     const totalCounts = +this.querySelector("[name=reps]").value;
//     const timeframe = this.querySelector("[name=timeframe").value;
// //Storing habit into an object
//     const habit = {
//         text: text,
//         reps: 0,
//         totalCounts: totalCounts,
//         timeframe: timeframe,
//         completed: false //by default in case habit is never completed
//     }

//     habits.push(habit)//add content to the array
//     listHabits(habits, habitsList); //Pushes the information to the array
//     localStorage.setItem('habits', JSON.stringify(habits))
//     this.reset(); //resets all fields on the form

//     console.log(habit) //Logs to the console for testing
// }


//List the habit
async function listsHabits(){
    try {
        const authHabits = await auth.userHabits();
        if(!authHabits) return;
        authHabits.map((obj) => {
            const list = habitItem(obj);
            habitsList.append(list);
        })
    } catch (error) {
        console.warn(error)
    }
}

async function createHabit(e){
    try {
        e.preventDefault();
        const create = await auth.postHabit(e);
        console.log(create);
        const list = habitItem(create);
        habitsList.append(list)
    } catch (error) {
        console.warn(error)
    }
}

function habitItem(obj){
    const list = document.createElement('li');

    const input = document.createElement('input');
    input.setAttribute('type','checkbox');
    input.setAttribute('id', `habit${obj.habit_id}`);
    list.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', `habit${obj.habit_id}`);

    const completeBtn = document.createElement('button');
    if (label.textContent.includes("COMPLETED!")){
        return;
    } else if (obj.curr_repetitions === obj.repetitions){
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}  |   COMPLETED!`;
    }
    else {
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}` 
    };
    list.appendChild(label);

    const div = document.createElement('div');
    div.setAttribute('class','habit-btns');

    const countBtn = document.createElement('button');
    countBtn.setAttribute('class','count');
    countBtn.setAttribute('id',`count${obj.habit_id}`);
    countBtn.textContent = "+";
    // countBtn.addEventListener('click', addReps(obj, label));
    countBtn.addEventListener('click', async function(){
        console.log(obj.habit_id)
        await auth.patchReps(obj.habit_id);
        label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}`;
        location.reload();
    });
    // countBtn.addEventListener('click', window.location.reload());
    div.appendChild(countBtn);

    // const completeBtn = document.createElement('button');
    completeBtn.setAttribute('class','complete');
    completeBtn.setAttribute('id',`complete${obj.habit_id}`);
    completeBtn.textContent = "Mark as Complete";
    completeBtn.addEventListener('click', function(){
        input.checked ? input.checked = false : input.checked = true;
    })
    div.appendChild(completeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class','delete');
    deleteBtn.setAttribute('id',`delete${obj.habit_id}`);
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener('click', async () => {
		await auth.deleteHabit(obj.habit_id);
		location.reload();
	});
    div.appendChild(deleteBtn);

    list.appendChild(div); 
    return list;   
}

// function addReps (obj, label){
//     auth.patchReps(obj.habit_id);
//     return label.textContent = `${obj.curr_repetitions}/${obj.repetitions}     |    ${obj.habit_name}   |    ${obj.frequency}`;
    
// }
// Function to add Habits to the HTML
// function listHabits(habits = [], habitsList) {
//     habitsList.innerHTML = habits.map((habit, i) => {
//         //What to add onto the HTML
//         return `
//         <li>
//         <input type="checkbox" data-index=${i} id="habit${i}" ${habit.completed ? "checked" : ""
//     } />
//         <label for="habit${i}">${habit.reps}/${habit.totalCounts} ${
//     habit.text}<br>
//     ${habit.timeframe}</label>
//             <div class="habit-btns">
//       <button class="count" data-index=${i}
//       id="count${i}">+</button>
//       <button class="complete" data-index=${i} id="complete${i}">Mark as Complete</button>
//       <button class="delete" data-index=${i} id="delete${i}">Delete</button>
//       </div>
//         </li>
//         `;
//     })
// }

//Toggle if complete

// function countComplete(e){ //Clicking on the checkbox
//     if (!e.target.matches('input')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     if (habits[index].reps === habits[index].totalCounts) {
//         habits[index].completed = true;
//     } else if (habits[index].reps > habits[index].totalCounts) {
//         habits[index].reps = 0;
//         habits[index].completed = false;
//     }

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
//     // console.log(e.target)
// }
// Count function

// function count(e){ //Clicking on the checkbox
//     if (!e.target.matches('.count')) return;
//     const el = e.target;
//     const index = el.dataset.index;
//     habits[index].reps += 1;

//     if (habits[index].reps === habits[index].totalCounts) {
//         habits[index].completed = true;
//         habits[index].reps += 0;
//     } else if (habits[index].reps > habits[index].totalCounts) {
//         habits[index].reps = 0;
//         habits[index].completed = false;
//     }

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
//     // console.log(e.target)
// }


//Delete Habit
// function deleteHabit(e) {
//     if (!e.target.matches('.delete')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     habits.splice(index, 1);

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
    

// }

//Mark as Complete
// function markComplete(e){
//     if (!e.target.matches('.complete')) return;
//     const el = e.target;
//     const index = el.dataset.index;

//     habits[index].completed = true;

//     listHabits(habits, habitsList);
//     localStorage.setItem("habits", JSON.stringify(habits));
    
// }


//Listen out for a submit, for the function to run
if(loadCheck){
    userMsg.textContent = `${auth.currUser}, choose a goal to achieve..`
    window.addEventListener('DOMContentLoaded', listsHabits);
// addHabits.addEventListener('submit', addHabit);
// habitsList.addEventListener('click', countComplete);
// habitsList.addEventListener('click', deleteHabit);
// habitsList.addEventListener('click', markComplete);
// habitsList.addEventListener('click', count);
// habitSubmit.addEventListener('submit', createHabit);
    addHabits.addEventListener('submit', createHabit);
// countBtn1.addEventListener('click', ()=>{
//     console.log('click');
// })
// window.addEventListener('load', () => {
//     Array.from(countBtn).forEach(b => {
//         b.addEventListener('click', function() {
//          console.log("clicked");});
//     })
// })
// countBtn.addEventListener("click", addReps);

// listHabits(habits, habitsList)
};

// logOut.addEventListener('click', () => {
//     window.location.pathname = ('client/login.html')
// })


module.exports = { createHabit, listsHabits, habitItem }


},{"./auth":1}],4:[function(require,module,exports){
"use strict";function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";const a=o;a.default=o,a.InvalidTokenError=n,module.exports=a;


},{}]},{},[2,1,3]);

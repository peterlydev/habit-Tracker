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

/**
* @jest-environment jsdom
*/

const fs = require('fs');
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const html = fs.readFileSync(path.resolve(__dirname, "../login.html"), "utf8");

describe('login.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {
        it('it has a title', () => {
            const title = document.querySelector('head title');
            expect(title).toBeTruthy();
            expect(title.textContent).toBe('Tracket Login')
        })

        it('it is linked to the correct css file', () => {
            const cssLink = document.querySelector('head link');
            expect(cssLink).toBeTruthy();
            expect(cssLink.href).toContain('styles.css')
        })
    })

    describe('body', () => {
        describe('header', () => {
            let header;
            let slogan;

            beforeEach(() => {
                header = document.getElementById('header');
                slogan = document.getElementById('slogan');
            })

            it('the main title exists and has the correct title', () => {
                expect(header).toBeTruthy();
                expect(header.textContent).toEqual('TRACKET');
            })

            it('the slogan exists and has the correct message', () => {
                expect(slogan).toBeTruthy();
                expect(slogan.textContent).toEqual('GOT A HABIT? TRACKET!');
            })
        })

        describe('login form', () => {
            let loginForm;
            let usernameInput;
            let passwordInput;
            let loginBtn;
            let forgottenPasswordLink;

            beforeEach(() => {
                loginForm = document.querySelector('#login-form');
                usernameInput = document.getElementById('username');
                passwordInput = document.getElementById('login-password');
                loginBtn = document.getElementById('login-btn');
                forgottenPasswordLink = document.getElementById('forgot-pw-link');
            })

            it('the login form exists', () => {
                expect(loginForm).toBeTruthy();
            });

            it('it has a text input for the username', () => {
                expect(usernameInput).toBeTruthy();
                expect(usernameInput.type).toBe('text');
                expect(usernameInput.name).toEqual('username');
                expect(usernameInput.placeholder).toEqual('Enter Username');
            });

            it('it has an input for password', () => {
                expect(passwordInput).toBeTruthy();
                expect(passwordInput.type).toBe('password');
                expect(passwordInput.name).toEqual('password');
                expect(passwordInput.placeholder).toEqual('Enter Password');
            });

            it('it has a login button', () => {
                expect(loginBtn).toBeTruthy();
                expect(loginBtn.textContent).toEqual('Login');
            })

            it('it has a forgotten password link', () => {
                expect(forgottenPasswordLink).toBeTruthy();
                expect(forgottenPasswordLink.href).toEqual('http://localhost/#');
                expect(forgottenPasswordLink.textContent).toEqual('Forgotten Password?');
            })
        })

        describe('register form', () => {
            let registerDiv;
            let createAccountMsg;
            let quickAndEasyMsg;
            let registerForm;
            let firstName;
            let surname;
            let username;
            let password;
            let registerBtn;

            beforeEach(() => {
                registerDiv = document.getElementById('register-div');
                createAccountMsg = document.getElementById('create-msg');
                quickAndEasyMsg = document.getElementById('quick-and-easy-msg');
                registerForm = document.getElementById('register-form');
                firstName = document.getElementById('first-name');
                surname = document.getElementById('last-name');
                username = document.getElementById('username-register');
                password = document.getElementById('password-register');
                registerBtn = document.getElementById('register-btn');
            })

            it('the register div exists', () => {
                expect(registerDiv).toBeTruthy();
            })

            it('it has a header with the right message', () => {
                expect(createAccountMsg).toBeTruthy();
                expect(createAccountMsg.textContent).toEqual('Create An Account');
            })

            it('it has a tagline with the right message', () => {
                expect(quickAndEasyMsg).toBeTruthy();
                expect(quickAndEasyMsg.textContent).toEqual("It's quick and easy!");
            })

            it('the register form exists', () => {
                expect(registerForm).toBeTruthy();
            });

            it('it has a text input for first name', () => {
                expect(firstName).toBeTruthy();
                expect(firstName.type).toBe('text');
                expect(firstName.placeholder).toEqual('Enter First Name');
            });

            it('it has a text input for surname', () => {
                expect(surname).toBeTruthy();
                expect(surname.type).toBe('text');
                expect(surname.placeholder).toEqual('Enter Last Name');
            });

            it('it has a text input for username', () => {
                expect(username).toBeTruthy();
                expect(username.type).toBe('text');
                expect(username.placeholder).toEqual('Enter Username');
            });

            it('it has an input for password', () => {
                expect(password).toBeTruthy();
                expect(password.type).toBe('password');
                expect(password.placeholder).toEqual('Enter Password');
            });

            it('it has a register button', () => {
                expect(registerBtn).toBeTruthy();
                expect(registerBtn.textContent).toEqual('Sign me up!');
            })
            
        })

        describe('footer', () => {
            let footer;
            let nav;

            beforeEach(() => {
                footer = document.getElementById('footer');
                nav = document.getElementById('footer-nav');
            })

            it('the footer exists and contains a nav', () => {
                expect(footer).toBeTruthy();
                expect(footer.children.length).toEqual(1);
            })

            it('the footer nav exists and has 8 child elements inside', () => {
                expect(nav).toBeTruthy();
                expect(nav.children.length).toEqual(8);
            })
        })
    })
})

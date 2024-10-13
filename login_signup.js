'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {
    id("login_form").addEventListener("submit", async (evt) => {
      evt.preventDefault();
      await loginRequest();
    });
    id("signup_form").addEventListener("submit", async (evt) => {
      evt.preventDefault();
      await signupRequest();
    });

    document.getElementById('show-signup-btn').addEventListener('click', function() {
      // Hide login form, show sign-up form
      document.getElementById('login_form').classList.add('hidden');
      document.getElementById('signup_form').classList.remove('hidden');
    });
    document.getElementById('show-login-btn').addEventListener('click', function() {
      // Hide sign-up form, show login form
      document.getElementById('signup_form').classList.add('hidden');
      document.getElementById('login_form').classList.remove('hidden');
    })
  }

  // Fetch request to login
  async function loginRequest() {
    try {
      let formData = new FormData(id("login_form"));
      let params = Object.fromEntries(formData.entries());
      let res = await fetch('http://127.0.0.1:5000/login', {  // Replace with actual backend URL
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      await statusCheck(res);
      res = await res.json();
      // Store the username in local storage
      localStorage.setItem('username', res.username);
      signIn(res);
    } catch (err) {
      handleError(err);
    }
  }

  // Fetch request to sign up
  async function signupRequest() {
    try {
      let formData = new FormData(id("signup_form"));
      let params = Object.fromEntries(formData.entries());
      let res = await fetch('http://127.0.0.1:5000/signup', {  // Replace with actual backend URL
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      await statusCheck(res);
      res = await res.json();
      // Store the username in local storage
      localStorage.setItem('username', res.username);
      login(res);
    } catch (err) {
        handleError(err);
    }
  }

   function handleError(err) {
    id('error').classList.remove("hidden");
    console.log(err);
   }

   function signIn(res) {
    location.assign("account.html");
   }
   function login(res) {
    document.getElementById('signup_form').classList.add('hidden');
    document.getElementById('login_form').classList.remove('hidden');
   }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function id(id) {
    return document.getElementById(id);
  }

})();

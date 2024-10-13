'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {

  }

   function handleError(err) {
    id('error').classList.remove("hidden");
    console.log(err);
   }

   async function getCheckBox() {
      try {
          let login = localStorage.getItem('username');
          let params = {
              username: login
          };
          let res = await fetch('http://127.0.0.1:5000/getblock', {
              method: "GET",
              body: JSON.stringify(params) 
          });
          await statusCheck(res);
          res = await res.json();
          return res.block;
      } catch(err) {
          handleError(err);
      }
   }

   function signIn(res) {
    location.assign("account.html");
    document.getElementById('blocker_val').checked = getCheckBox();
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

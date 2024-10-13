'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {

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

'use strict';

(function() {

  window.addEventListener('load', init);

  function init() {
    id("login_form").addEventListener("submit", async (evt) => {
      evt.preventDefault();
      await makeRequest();
    });
  }

  async function makeRequest() {
    try {
      let formData = new FormData(id("login_form"));
      let params = Object.fromEntries(formData.entries());
      let res = await fetch('http://127.0.0.1:5500/login.html', {  // Replace with actual backend URL
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      await statusCheck(res);
      res = await res.json();
      signIn(res);
    } catch (err) {
      handleError(err);
    }
   }

   function handleError(err) {
    id('error').classList.remove("hidden");
    console.log(err);
   }

   function signIn() {
    location.assign("account.html");
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

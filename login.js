'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * TODO - setup the sign-in button on initial page load
   */
  function init() {
    id("login_form").addEventListener("submit", async (evt) => {
      evt.preventDefault();
      await makeRequest();
    });
  }

  async function makeRequest() {
    try {
      let params =  new FormData(id("login_form"));
      let res = await fetch('http://127.0.0.1:5500/login.html', {
        method: "POST",
        body: params
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
  /**
   * TODO
   * signIn - Signs the user in based on username and password inputs
   */
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

  function qs(selector) {
    return document.querySelector(selector);
  }
})();

'use strict';

(function() {

  window.addEventListener('blocker_btn', init);

  function init() {
      loadAccount();
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

   function loadAccount(res) {
    id('blocker_val').checked = getCheckBox();
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

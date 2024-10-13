'use strict';

(function() {
  let currBlock = getCheckBox();
  window.addEventListener('load', init);

  function init() {
    if(currBlock) {
      id('blocker_val').checked = true;
    } else {
      id('blocker_val').checked = false;
    }
    id('blocker_btn').addEventListener('click', updateBlock);
  }

   function handleError(err) {
    id('error').classList.remove("hidden");
    console.log(err);
   }

   async function updateBlock() {
    try {
      let bool = id('blocker_val').checked;
      let login = sessionStorage.getItem('username');
      let blockNum = 0;
      if(bool) {
        blockNum = 1;
      }
      let params = {
        username: login,
        block: blockNum
      };
      let res = await fetch('http://127.0.0.1:5000/changeblock', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'  // Set the content type to JSON
        },
        body: JSON.stringify(params)
      });
      await statusCheck(res);
      currBlock = bool;
    } catch (err) {
      handleError(err);
    }
   }

   async function getCheckBox() {
      try {
          let login = sessionStorage.getItem('username');
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

   async function loadAccount(res) {
    id('blocker_val').checked = await getCheckBox();
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

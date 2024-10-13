'use strict';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

(function() {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCe4FLr_VkD9cmN4Za6VAiGJ5GOtDAuTWQ",
    authDomain: "tiltai.firebaseapp.com",
    projectId: "tiltai",
    storageBucket: "tiltai.appspot.com",
    messagingSenderId: "818461348700",
    appId: "1:818461348700:web:335c63db3901d1fff96799",
    measurementId: "G-371C4M5PC5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

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
      let res = await fetch(BASE_URL, {
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
    location.assign("index.html");
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

"use strict";

(function() {
    id('start').addEventListener('click', runPokerNowGrabber);
    function updateTiltDisplay(tilt) {
        // Convert tilt (0 to 1) to percentage (0 to 100)
        const tiltPercentage = tilt * 100;
        const tiltBar = document.getElementById('tilt-bar');

        // Update the width based on the tilt percentage
        tiltBar.style.width = tiltPercentage + '%';

        // Adjust the gradient based on the tilt percentage
        let gradient;
        if (tiltPercentage <= 75) {
            // Smooth gradient transition for green
            const greenShade = Math.max(0, 255 - (tiltPercentage * 3.4)); // Adjust green shade for smooth transition
            gradient = `linear-gradient(to right, rgb(0, ${greenShade}, 0), rgb(0, 255, 0))`;
        } else {
            // Stronger and brighter red transition after 75%
            const redShade = Math.min(255, (tiltPercentage - 75) * 10); // Increase red shade intensity significantly
            gradient = `linear-gradient(to right, rgb(0, 255, 0), rgb(${redShade}, 0, 0))`;
        }

        // Update the gradient background
        tiltBar.style.background = gradient;
    }

    async function runPokerNowGrabber() {
        for (let i = 0; i < 15; i++) {
          try {
            const queryParams = new URLSearchParams(params).toString();
            const url = "http://127.0.0.1:5000/getpercentage";
            let res = await fetch(url, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              }
            });
            await statusCheck(res);
            res = await res.json();
            updateTiltDisplay(res.percentage);
          } catch (err) {
            handleError(err);
          }
        }
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
    // const interval = setInterval(() => {
    //     if (tilt <= 1) {
    //         updateTiltDisplay(tilt);
    //         tilt += 0.025; // Increase the tilt gradually (slower animation)
    //     } else {
    //         clearInterval(interval); // Stop when the tilt reaches 1
    //     }
    // }, 1000); // Change tilt value every 100ms
})();

"use strict";

(function() {
    function updateTiltDisplay(tilt) {
        // Convert tilt (0 to 1) to percentage (0 to 100)
        const tiltPercentage = tilt * 100;
        const tiltBar = document.getElementById('tilt-bar');

        // Update the width based on the tilt percentage
        tiltBar.style.width = tiltPercentage + '%';

        // Adjust the gradient based on the tilt percentage
        const greenShade = Math.max(0, 255 - (tiltPercentage * 2.55)); // Darker green as tilt increases
        const redShade = Math.min(255, tiltPercentage * 2.55); // Increasing red as tilt increases

        // Update the gradient with dynamic green and red values
        tiltBar.style.background = `linear-gradient(to right, rgb(0, ${greenShade}, 0), rgb(${redShade}, 0, 0))`;
    }

    // Simulate the tilt bar gradually increasing from 0 to 1
    let tilt = 0;
    const interval = setInterval(() => {
        if (tilt <= 1) {
            updateTiltDisplay(tilt);
            tilt += 0.02; // Increase the tilt more slowly
        } else {
            clearInterval(interval); // Stop when the tilt reaches 1
        }
    }, 300); // Change tilt value every 300ms (3 seconds for 0.2 increments)
})();

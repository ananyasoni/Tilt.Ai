"use strict";

(function() {
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

    // Simulate the tilt bar gradually increasing from 0 to 1
    let tilt = 0;
    fetch('/predict', {
        method : 'POST',
        body: JSON.stringify(/*Something goes here*/)
    })
    .then(response => response.json())
    .then(data => {
        tilt = data[0];
    })
    .catch(error => console.error('Error:', error));

    const interval = setInterval(() => {
        if (tilt <= 1) {
            updateTiltDisplay(tilt);
            tilt += 0.025; // Increase the tilt gradually (slower animation)
        } else {
            clearInterval(interval); // Stop when the tilt reaches 1
        }
    }, 100); // Change tilt value every 100ms
})();

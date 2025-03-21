fetch("cars.json") // Step 1: Load the JSON file
    .then(response => response.json()) // Step 2: Convert response to JSON
    .then(data => { // Step 3: Process the JSON data
        let carList = document.getElementById("car-list"); // Find the car list section

        data.forEach(car => { // Loop through each car in the JSON file
            let carItem = document.createElement("div"); // Create a new div for each car
            carItem.classList.add("car-card"); // Add a CSS class for styling

            carItem.innerHTML = `
                <img src="${car.image}" alt="${car.name}">
                <h3>${car.name} (${car.year})</h3>
                <p><strong>Engine:</strong> ${car.engine}</p>
                <p><strong>Horsepower:</strong> ${car.horsepower} HP</p>
                <p><strong>Price:</strong> ${car.price}</p>
            `; // Insert car details into the div

            carList.appendChild(carItem); // Add this car to the page
        });
    })
    .catch(error => console.error("Error loading cars:", error)); // Handle any errors
fetch("cars.json") // Loading JSON File
    .then(response => response.json()) // Converts response to json
    .then(data => {

        let featuredContainer = document.getElementById("featured-car-container");

        let randomCar = data[Math.floor(Math.random() * data.length)];

        let featuredCar = document.createElement("div"); // creates div for the car
        featuredCar.classList.add("car-card"); // Adds a class to style with

       // Div containing car details
        featuredCar.innerHTML = `
            <img src="${randomCar.image}" alt="${randomCar.name}">
            <h3>${randomCar.name} (${randomCar.year})</h3>
            <p><strong>Engine:</strong> ${randomCar.engine}</p>
            <p><strong>Horsepower:</strong> ${randomCar.horsepower}</p>
            <p><strong>Price:</strong> ${randomCar.price}</p>
            `;
        
        featuredContainer.appendChild(featuredCar); // Adds car to the webpage
    })
    


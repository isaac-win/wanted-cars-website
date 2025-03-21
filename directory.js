fetch("cars.json") // load the json file
    .then(response => response.json()) // converts response to json
    .then(data => {
        let carList = document.getElementById("car-list");

        if (!carList) {
            console.error("Error: 'car-list' not found in cars.html.");
            return;
        }

        data.forEach(car => {
            let carItem = document.createElement("div");
            carItem.classList.add("car-card"); // adds styling

            carItem.innerHTML = `
                <img src="${car.image}" alt="${car.name}">
                <h3>${car.name} (${car.year})</h3>
                <p><strong>Engine:</strong> ${car.engine}</p>
                <p><strong>Horsepower:</strong> ${car.horsepower} HP</p>
                <p><strong>Price:</strong> ${car.price}</p
            
            `;
            carList.appendChild(carItem);

        });
    })

    .catch(error => console.error("Error loading car directory:", error));
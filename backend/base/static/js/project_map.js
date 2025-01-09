
// Map for Projects page 
// Looking to find a way to bring map coordinates into this file and zoom map to exact location 


var map = L.map('map').setView([54.64097248257176, -5.949570423358756], 15); // defaultd coords atm for test project

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

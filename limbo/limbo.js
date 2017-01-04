$(document).ready(function() {
    sendRequest();
});

function initAutocomplete() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.7392,
            lng: -104.9903
        },
        zoom: 12,
        mapTypeId: 'roadmap'
    });

    let infoWindow = new google.maps.InfoWindow({
        map: map
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your Location');
            map.setCenter(pos);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    // Create the search box and link it to the UI element.
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
        let places = searchBox.getPlaces();
        console.log(places);
        createContact(places);

        if (places.length === 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        let bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            let icon = {
                url: place.icon,
                size: new google.maps.Size(50, 50),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        map.setZoom(18);
    });
}

function createContact(places) {
    let $placecontact = $('.place-contact');
    let contact = `<div class="card">
      <div class="card-block">
        <h4 class="card-title">${places[0].name}</h4>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${places[0].formatted_address}</li>
        <li class="list-group-item">${places[0].formatted_phone_number}</li>
        <li class="list-group-item"><a href="#" class="card-link">${places[0].website}</a></li>
      </ul>
    </div>`;
    if ($(".card")[0]) {
        $('.card').empty();
        $placecontact.append(contact);
    } else {
        $placecontact.append(contact);
    }
}

function sendRequest(data) {
    const API_URL = 'http://localhost:3000';
    $('#request-button').click(function(event) {
        event.preventDefault();
        let formObj = {};
        formObj.location = $('#pac-input').val();
        formObj.phone = $('#date-input').val();
        formObj.time = $('#time-input').val();
        console.log(formObj);
        $.post(API_URL).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.error(error);
        });
    });
}
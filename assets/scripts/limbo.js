const CLIENT_URL = getUrl1();
const API_URL = getUrl2();



$(document).ready(function() {
    sendRequest();
    dateInput();
    timeInput();
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
        <li class="list-group-item phone">${places[0].formatted_phone_number}</li>
      </ul>
    </div>`;
    if ($(".card")[0]) {
        $('.card').empty();
        $placecontact.append(contact);
    } else {
        $placecontact.append(contact);
    }
}

function sendRequest() {
    $('#request-button').click(function(event) {
        event.preventDefault();
        let formObj = {};
        formObj.name = nameSplit();
        formObj.address = addressSplit();
        formObj.date = $('#date-input').val();
        formObj.lat = 123;
        formObj.long = 234;
        formObj.time = $('#time-input').val();
        formObj.status = 'Requested';
        formObj.rate = 2;
        formObj.start_time = $('#time-input').val();
        formObj.end_time = $('#time-input').val();
        formObj.phone = $('.phone').html();
        console.log(formObj);
        $.post(`${API_URL}/users/jobs`, formObj).then(function(result) {
            window.location.replace(`${CLIENT_URL}/dashboard.html`);
        }).catch(function(error) {
            if (error.status === 401) {
                window.location = '/signin.html';
            } else {
                console.log(error);
            }
        });
    });
}

function addressSplit() {
    let address = $('#pac-input').val().split(',').slice(1).join(',').trim(' ');
    return address;
}

function nameSplit() {
    let name = $('#pac-input').val().split(',')[0];
    return name;
}

function dateInput() {
    let today = moment(moment()).format('YYYY-MM-DD');
    return $('#date-input').val(today);
}

function timeInput() {
    let now = moment(moment()).format('H:mm');
    console.log(now);
    return $('#time-input').val(now);
}

function getUrl1() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:8080';
    } else {
        return 'https://line-waiter.firebaseapp.com';
    }
}

function getUrl2() {
    if (window.location.host.indexOf('localhost') != -1) {
        return 'http://localhost:3000';
    } else {
        return 'https://line-waiter-db.herokuapp.com';
    }
}

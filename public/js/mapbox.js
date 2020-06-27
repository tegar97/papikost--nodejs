const mapBox = document.getElementById('map');
const locations = JSON.parse(mapBox.dataset.locations);


mapboxgl.accessToken = 'pk.eyJ1IjoidGVnYXI5NyIsImEiOiJja2E5b3RsdXkwazRnMnFxZnhqa2l2bXZuIn0.XMtCfzzp6x1iZkFEuWPADA';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',

});

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    const mapData = loc.location
    const el =document.createElement('div')
    el.className = 'marker'
    new mapboxgl.Marker({
        element : el,
        anchor : 'bottom'
    }).setLngLat(mapData.coordinates).addTo(map)

    bounds.extend(mapData.coordinates)
})

map.fitBounds(bounds);


const mapData = document.getElementById('map')
const locations = JSON.parse(mapData.dataset.locations)

mapboxgl.accessToken = 'pk.eyJ1IjoidGVnYXI5NyIsImEiOiJja2E5b3RsdXkwazRnMnFxZnhqa2l2bXZuIn0.XMtCfzzp6x1iZkFEuWPADA';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center : [110.373638,-7.787432],
    zoom: 12
    
   

});
const bounds = new mapboxgl.LngLatBounds()
//ADD MARKER
const el =document.createElement('div')
el.className = 'marker'
new mapboxgl.Marker({
    element : el,
    anchor : 'bottom'
}).setLngLat(locations.coordinates).addTo(map)
map.addControl(new mapboxgl.FullscreenControl());


//ADD POPUP
new mapboxgl.Popup({
    offset: 30
}).setLngLat(locations.coordinates).setHTML(`<p class="primary-text">alamat :${locations.address}</p>`).addTo(map)
bounds.extend(mapData.coordinates)


map.fitBounds(bounds,{
    padding :{
        top : 200,
        bottom : 200,
        left: 100,
        right: 100
    }
});

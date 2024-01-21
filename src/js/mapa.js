(function() {

    const lat = document.querySelector('#lat' ).value || 37.2534918;
    const lng = document.querySelector('#lng' ).value || -6.9528184;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El pin
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar movimiento del pin
    marker.on('moveend', function(event){
        marker = event.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
    
        //Obtener informacion de la calle del pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error,resultado){
            marker.bindPopup(resultado.address.LongLabel)

            //Llenar los campos en crear.pug
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })

})()
(function(){
    const lat = 37.2534918;
    const lng = -6.9528184;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []

    //filtro
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa)

    //filtrado de Categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })
    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
        } catch (error) {
            console.log(error)
        }
    }
    const mostrarPropiedades = propiedades => {
        //limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}
                <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt=Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `) //text-white se especifica en public->css->tailwind.css linea 6
            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio ) //method chaining
        mostrarPropiedades(resultado)
    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.CategoriaId === filtros.categoria : propiedad //funcion

    const filtrarPrecio = propiedad => filtros.precio ? propiedad.PrecioId === filtros.precio : propiedad //funcion
    
    obtenerPropiedades()
})()
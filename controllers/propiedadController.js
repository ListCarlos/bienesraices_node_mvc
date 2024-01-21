import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/index.js'
import { esVendedor, formatearFecha } from '../helpers/index.js'

const admin =  async ( req, res) => {


//leer querystring
    const { pagina: paginaActual } = req.query
    const expresion = /^[0-9]$/
    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario

        //limites y offset para el paginador
        const limit = 10
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
            await Propiedad.findAll({
                limit,//limit:limit
                offset,//offset:offset
                
                where: {
                    UsuarioId : id
                },
                include: [
                    { model: Categoria, as:'Categoria'},
                    { model: Precio, as:'Precio'},
                    { model: Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({
                where: {
                    UsuarioId : id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            csrfToken: req.csrfToken(),
            propiedades,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }
}
//formulario para crear una nueva propiedad
const crear = async (req, res) => {
    //Consultar Modelo de precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias, //categorias: categorias
        precios, //precios: precios
        datos: {}
    })
}

const guardar = async (req, res) => {
    //Validacion
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){
        //Consultar Modelo de precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias, //categorias: categorias
            precios, //precios: precios
            errores: resultado.array(),
            datos: req.body
        })
    }
    // Crear un registro

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: PrecioId, categoria: CategoriaId} = req.body
    
    const { id: UsuarioId } = req.usuario
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            PrecioId,
            CategoriaId,
            UsuarioId,
            imagen: ''                
        })

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}

const agregarImagen = async (req, res) => {
    
    const { id } = req.params

    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }
    //Validar pertenece al usuario
    if( req.usuario.id.toString() !== propiedad.UsuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req,res, next) => {

    const { id } = req.params

    // Validar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')
    }
    //Validar pertenece al usuario
    if( req.usuario.id.toString() !== propiedad.UsuarioId.toString() ) {
        return res.redirect('/mis-propiedades')
    }

    try {   
        
        // Almacenar la imagen y publicar la propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }

}

const editar = async (req,res) => {

    const { id } = req.params

    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    
    //Validar usuario
    if( propiedad.UsuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }


    //Consultar Modelo de precio y Categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias, //categorias: categorias
        precios, //precios: precios
        datos: propiedad
    })
}

const guardarCambios = async (req,res) => {

    //Verificar Validación
    //Validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        //Consultar Modelo de precio y Categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias, //categorias: categorias
            precios, //precios: precios
            errores: resultado.array(),
            datos: req.body
        })
    }
    const { id } = req.params

    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    
    //Validar usuario
    if( propiedad.UsuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }

    //Reescribir el objeto
    try {
        
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: PrecioId, categoria: CategoriaId} = req.body
        
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            PrecioId,
            CategoriaId
        })

        await propiedad.save()

        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error)
    }

}

const eliminar = async (req, res) => {

    const { id } = req.params
    
    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    
    //Validar usuario
    if( propiedad.UsuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }

    //Eliminar Imagen Propiedad
    await unlink(`public/uploads/${propiedad.imagen}`)

    //Eliminar Propiedad
    await propiedad.destroy()

    res.redirect('/mis-propiedades')
}

//modifica el estado de la propiedad
const cambiarEstado = async (req, res) => {
    
    const { id } = req.params
    
    //Validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    
    //Validar usuario
    if( propiedad.UsuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }

    //Actualizar
    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })
}


//Muestra una propiedad
const mostrarPropiedad = async (req,res) => {

    const { id } = req.params

    //comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as:'Categoria'},
            { model: Precio, as:'Precio'}
        ]
    })

    if(!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.UsuarioId)
    })
}

const enviarMensaje = async (req,res) => {

    const { id } = req.params

    //comprobar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as:'Categoria'},
            { model: Precio, as:'Precio'}
        ]
    })

    if(!propiedad) {
        return res.redirect('/404')
    }

    //Renderizar los errores
        //Validacion
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){
    
        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.UsuarioId),
            errores: resultado.array()
        })
    }
    console.log(req.body)
    console.log(req.params.id)
    console.log(req.usuario.id)
    
    
    const { mensaje } = req.body
    const {id: propiedadId } = req.params
    const {id: usuarioId } = req.usuario

    //Almacenar el mensaje
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    res.redirect('/')

}

//Leer mensajes recibidos
const verMensajes = async (req, res) => {

    const { id } = req.params
    
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Mensaje, as: 'mensajes',
                include: [
                    {model: Usuario.scope('eliminarPassword'), as: 'usuario'}
                ]
            },
        ]
    })
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }
    
    //Validar usuario
    if( propiedad.UsuarioId.toString() !== req.usuario.id.toString() ){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes',{
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}
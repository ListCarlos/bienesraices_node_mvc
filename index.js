//const express = require('express')
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './route/usuarioRoutes.js'
import propiedadesRoutes from './route/propiedadesRoutes.js'
import db from './config/db.js'
import appRoutes from './route/appRoutes.js'
import apiRoutes from './route/apiRoutes.js'

//crear la app
const app = express()

//Habilitar lectura de datos del formulario
app.use( express.urlencoded({extended: true}) )

//Habilitar cookieParser
app.use( cookieParser() )

//Habilitar CSRF
app.use( csrf({cookie: true}) )

// conexion a la base de datos

try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la Base de datos')
} catch (error) {
    console.log(error)
}

//habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// carpeta publica
app.use( express.static('public') )

//routing
//app.get('/', usuarioRoutes)
//app.get('/testjson', usuarioRoutes)
app.use('/api', apiRoutes)
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)


//definir un puerto

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
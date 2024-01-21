import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailPassword } from '../helpers/emails.js'
const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken : req.csrfToken()
    })
}

const autenticar = async (req, res) => {

    //Validacion
    await check('email').isEmail().withMessage('El Email es Obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es Obligatorio').run(req)

    let resultado = validationResult(req)

    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: resultado.array()            
        })
    }
    const { email, password } = req.body
    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: { email }})
    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Usuario No Existe'}]            
        })
    }
    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Usuario No Esta Confirmado'}]            
        })
    }
    // Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg: 'El Password es Incorrecto'}]            
        })
    }

    //Autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre})
    //almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true //solo para https requiere SSL
        //sameSite: true
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) => {

    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {

    //console.log(req.csrfToken())

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken : req.csrfToken()
    })
}



const registrar = async (req, res) => {
            
    // validacion
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Tiene que ser un email valido').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req)
    
    let resultado = validationResult(req)

    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                    nombre: req.body.nombre,
                    email: req.body.email
                }
        })
    }
    //Extraer lost datos
    const { nombre, email, password} = req.body

    //Verificar que le usuario no este duplicado
    const existeUsuario = await Usuario.findOne( { where : { email } })
    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El Usuario ya esta Registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    
    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de confirmación

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona en el enlace'
    })
}


// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params
    console.log( token )

    // Verificar si el token es valido
    const usuario = await Usuario.findOne({ where : {token} })
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }
    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó Correctamente',
        error: false
    })
}


const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken : req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Tiene que ser un email valido').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar el usuario

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: {email}} )
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken : req.csrfToken(),
            errores: [{msg : 'El Email no Pertenece a Ningún usuario'}]
        })
    }
    // Generar un email
    usuario.token = generarId();
    await usuario.save();

    //Enviar un Email
    emailPassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })
    //Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos Enviado un Email con las Instrucciones'
    })
}

const comprobarToken = async (req, res) => {

    const { token } = req.params;
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken()

    })
}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req)
    let resultado = validationResult(req)

    // verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
        })
    }
    const { token } = req.params
    const { password } = req.body;
    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}})


    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash( password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente'
    })
}


export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}
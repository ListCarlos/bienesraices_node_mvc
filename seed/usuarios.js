import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Carlos',
        email: 'carfuacebes@hotmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('contraseña', 10)
    }
]
export default usuarios
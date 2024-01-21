import categorias from './categorias.js'
import precios from './precios.js'
import usuario from './usuarios.js'
import db from '../config/db.js'
import { Categoria, Precio, Usuario } from '../models/index.js'

const importarDatos = async () => {
    try {
        //Auntenticar
        await db.authenticate()

        //Generar las columnas
        await db.sync()

        // Insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuario)
        ])
        console.log('Datos Importados Correctamente')
        process.exit()

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try {
       // await Promise.all([
       //     Categoria.destroy({where: {}, truncate: true}),
       //     Precio.destroy({where: {}, truncate: true})
       // ])
        await db.sync({force: true})
        console.log('Datos Eliminados Correctamente')
        process.exit()
    } catch {
        console.log(error)
        process.exit(1)
    }
}


if(process.argv[2] === "-i") {
    importarDatos();

}
if(process.argv[2] === "-e") {
    eliminarDatos();

}

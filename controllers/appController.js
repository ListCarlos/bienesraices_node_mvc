import { Sequelize } from 'sequelize'
import { Propiedad, Precio, Categoria} from '../models/index.js'

const inicio = async (req,res) => {



    const [categorias, precios, casas, pisos ] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                CategoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                CategoriaId: 2
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC'] //ASC
            ]
        })

    ])

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        pisos,
        csrfToken: req.csrfToken() 
    })
}

const categoria = async (req,res) => {
    const { id } = req.params

    //comprobar que exista la categoria
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }
    //obtener las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            CategoriaId: id
        },
        include: [
            {model: Precio, as: Precio}
        ]
    })

    res.render ('categoria', {
        pagina: `${categoria.nombre} en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req,res) => {
    const { termino } = req.body

    //Validar que termino no este vacio
    if(!termino.trim()) {
        return res.redirect('back')
    }

    //Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%' //busca en cualquier lugar de la cadena de texto
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultado de la Busqueda',
        propiedades,
        csrfToken: req.csrfToken()
    })
}

const pag404 = (req,res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
}

export {
    inicio,
    categoria,
    buscador,
    pag404
}
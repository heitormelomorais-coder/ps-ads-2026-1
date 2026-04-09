import { prisma } from '../database/client.js'

const controller = {}

/*
  Cria um novo vendedor (Seller)
  POST /sellers
*/
controller.create = async function(req, res) {
  try {
    // Para vendedores, não usamos argon2 nem campos de senha,
    // pois o model Seller no schema.prisma não possui esses campos.
    await prisma.seller.create({ data: req.body })

    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

/*
  Lista todos os vendedores
  GET /sellers
*/
controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.seller.findMany({
      orderBy: [ { fullname: 'asc' } ]
    })
    res.send(result)
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

/*
  Recupera um único vendedor pelo ID
  GET /sellers/:id
*/
controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.seller.findUnique({
      where: { id: Number(req.params.id) }
    })

    if(result) res.send(result)
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

/*
  Atualiza dados de um vendedor
  PUT /sellers/:id
*/
controller.update = async function(req, res) {
  try {
    await prisma.seller.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    // HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    if(error?.code === 'P2025') res.status(404).end()
    else res.status(500).end()
  }
}

/*
  Exclui um vendedor
  DELETE /sellers/:id
*/
controller.delete = async function(req, res) {
  try {
    await prisma.seller.delete({
      where: { id: Number(req.params.id) }
    })

    // HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    if(error?.code === 'P2025') res.status(404).end()
    else res.status(500).end()
  } 
}

export default controller
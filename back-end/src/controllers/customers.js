import { prisma } from '../database/client.js'


const controller = {}   // Objeto vazio


// Todas as funções de controller têm, pelo menos,
// dois parâmetros:
// req ~> representa a requisição (request)
// res ~> representa a resposta (response)
controller.create = async function(req, res) {
 try {
  if (!prisma || !prisma.customer) {
      console.error("ERRO: O Prisma Client não carregou o model 'customer' corretamente.")
      return res.status(500).send({ error: "Erro interno na conexão com o banco" })
    }

    // Tenta criar o cliente usando os dados do body
    const result = await prisma.customer.create({ data: req.body })
    
    console.log('Cliente criado com sucesso:', result.id)
    res.status(201).end()
  }
  catch(error) {
    console.error("ERRO AO CRIAR CLIENTE:")
    console.error(error)
    
    // Se for erro de campo faltando ou tipo errado
    if(error.code === 'P2002') {
      return res.status(400).send({ error: "Documento ou Email já existente" })
    }
    
    res.status(500).send({ 
      message: "Erro ao processar criação",
      error: error.message 
    })
 }
}

controller.retrieveAll = async function(req, res) {
 try {
   if (prisma && prisma.customer) {
      const result = await prisma.customer.findMany({
        orderBy: [ { name: 'asc' } ]
      })
      res.send(result)
    } else {
      throw new Error("Objeto prisma.customer não encontrado")
    }
  }
  catch(error) {
    console.error("ERRO NA LISTAGEM DE CLIENTES:")
    console.error(error)
    res.status(500).send({ error: "Erro interno ao listar clientes" })
 }
}

controller.retrieveOne = async function(req, res) {
 try {
   // Busca no banco de dados apenas o registro indicado
   // pelo parâmetro "id"
   const result = await prisma.customers.findUnique({
     where: { id: Number(req.params.id) }
   })


   // Encontrou ~> HTTP 200: OK (implícito)
   if(result) res.send(result)
   // Não encontrou ~> HTTP 404: Not Found
   else res.status(404).end()
 }
 catch(error) {
   // Se algo de errado ocorrer, cairemos aqui
   console.error(error)  // Exibe o erro no terminal


   // Enviamos como resposta o código HTTP relativo
   // a erro interno do servidor
   // HTTP 500: Internal Server Error
   res.status(500).end()
 }
}

controller.update = async function(req, res) {
 try {
   const model = prisma.customer || prisma.Customer
    
    await model.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
    res.status(204).end()
  }
  catch(error) {
    console.error("ERRO NA ATUALIZAÇÃO:")
    console.error(error)
    if(error?.code === 'P2025') res.status(404).send({ error: "Cliente não encontrado" })
    else res.status(500).send(error)
 }
}

controller.delete = async function(req, res) {
 try {
   const model = prisma.customer || prisma.Customer

    await model.delete({
      where: { id: Number(req.params.id) }
    })
    res.status(204).end()
  }
  catch(error) {
    console.error("ERRO NA EXCLUSÃO:")
    console.error(error)
    if(error?.code === 'P2025') res.status(404).send({ error: "Cliente não encontrado" })
    else res.status(500).send(error)
 } 
}

export default controller
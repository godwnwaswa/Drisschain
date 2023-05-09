let items = require('../items')

const getItems = (req, reply) => {
    reply.send(items)
}

const getItem = (req, reply) => {
    const { id } = req.params
    const item = items.find(item => item.id == id)
    reply.send(item)
}


const addItem = (req, reply) => {

    const item = req.body

    items = [...items, item]

    reply.code(201).send(item)
}

const deleteItem = (req, reply) => {
    const {id} = req.params

    items = items.filter( item => item.id != id)

    reply.send({message: `Item ${id} has been deleted`})

}

module.exports = { getItem, getItems, addItem, deleteItem}
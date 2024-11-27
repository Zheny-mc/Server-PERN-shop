const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) {
        const {rate} = req.body
        const brand = await Brand.create({rate: rate})
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async getById(req, res) {
        res.json({message: "get device by id"})
    }

    async remove(req, res) {
        res.json({message: "remove device by id"})
    }
}

module.exports = new BrandController()
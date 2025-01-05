const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')
const { Device, DeviceInfo } = require('../models/models')
const fs = require("fs");

class DeviceController {
    async create(req, res, next) {
        try {
            const {name, price, brandId, typeId, info} = req.body
            const { img } = req.files
            let filename = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, '..', 'static', filename))
            const device = await Device.create({name, price, brandId, typeId, img: filename})
            
            if (info) {
                const parseInfo = JSON.parse(info)
                parseInfo.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                })
            }

            return res.json(device)
        } catch(e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 3
        const offset = page * limit - limit
        
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        else if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        else if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        else if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset})
        }
        
        return res.json(devices)
    }

    async getById(req, res) {
        const id = Number(req.params.id);
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )
        return res.status(200).json(device);
    }

    async remove(req, res, next) {
        const id = Number(req.params.id)
        const filename = await Device.findByPk(id).then((d) => d.img)
        fs.unlink(path.resolve(__dirname, '..', 'static', filename), (error) => {
            if (error) return console.log(error); // если возникла ошибка 
            console.log("File deleted");
        });

        Device.destroy({ where: { id } }).then((deletedRecord) => { 
            if (deletedRecord === 1){
                res.status(200).json({message: `Deleted device id=${id} successfully`}) 
            } else {
                next(ApiError.badRequest("record not found"))
            }
        }, 
        (err) => {
            console.error(err); 
            next(ApiError.internal("Error!"))
        }); 
    }
    
}

module.exports = new DeviceController()

const categoryModel = require("../Models/districtModel")
const fs = require('fs');

const addDistrict = async (req, res) => {
    try {
        const { name } = req.body;
        let image = "";
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        } const category = await categoryModel.create({ name, image })
        return res.send(
            {
                status: true,
                data: {
                    id: category.id,
                    name: category.name,
                    image: image
                }
            }
        );
    } catch (e) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        if (e.code === 11000) {
            console.log('Duplicate key error:', e.message);
            return res.status(400).send({ status: false, message: "The category Exists" });
        }
        return res.status(500).send({ message: "Something went wrong" });
    }
}

const updateDistrict = async (req, res) => {
    try {
        const { id, name } = req.body;
        if (!id) return res.status(400).send({ status: 400, message: "Invalid request" })
        const updateObject = {name };

        if (req.file) {
            updateObject.image = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        }
        const category = await categoryModel.findByIdAndUpdate(id, updateObject, { new: true })
        return res.send(
            {
                status: true,
                message: "Updated successfully",
                data: {
                    id: category.id,
                    name: category.name,
                    image: category.image
                }
            }
        );
    } catch (e) {
        console.log(e);
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        if (e.code === 11000) {
            console.log('Duplicate key error:', e.message);
            return res.status(400).send({ status: false, message: "The category Exists" });
        }
        return res.status(500).send({ message: "Something went wrong" });
    }
}

const getDistricts = async (_, res) => {
    try {
        const data = await categoryModel.find({})
        const array = data.map((category) => ({
            id: category._id,
            name: category.name,
            image: category.image,
        }));

        return res.send(
            {
                status: true,
                data: array
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Something went wrong" });
    }
}

module.exports = { addDistrict, getDistricts, updateDistrict }
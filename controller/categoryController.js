
const categoryModel = require("../Models/categoryModel")
const fs = require('fs');

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let image = "";
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/${req.file.path}`;
        } const category = await categoryModel.create({ name, description, image })
        return res.send(
            {
                status: true,
                data: {
                    id: category.id,
                    name: category.name,
                    description: category.description,
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

const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (!id) return res.status(400).send({ status: 400, message: "Invalid request" })
        const updateObject = {
            name,
            description,
        };

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
                    description: category.description,
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

const getCategories = async (_, res) => {
    try {
        const data = await categoryModel.find({})
        const array = data.map((category) => ({
            id: category._id,
            name: category.name,
            description: category.description,
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

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        let data = await categoryModel.findOneAndDelete({ _id: id })
        if(data==null){
            return res.status(400).send({ message: "No category found" });
        }
        if (data.image) {
            const image = data.image.replace(`${req.protocol}://${req.get('host')}/`, "");
            if (fs.existsSync(image)) {
                fs.unlink(image, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
        return res.send(
            {
                status: true,
                message: "deleted successfully"
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).send({ message: "Something went wrong" });
    }
}

module.exports = { addCategory, getCategories, updateCategory, deleteCategory }
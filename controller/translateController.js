var translate = require('translation-google');


const translateText = async (req, res) => {
    try {
        const { prompt } = req.body
        const text=await translate(prompt, {from: 'en',to: 'ml'});
        return res.send(
            {
                status: true,
                data: text.text,
            }
        )
    } catch (e) {
        console.log(e);
        return res.status(500).send(
            {
                status: false,
                message: "Something went wrong",
            }
        )
    }
}

module.exports = { translateText };
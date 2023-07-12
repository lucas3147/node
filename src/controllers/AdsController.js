const Category = require('../models/Category');
const User = require('../models/User');
const Ad = require('../models/Ad');

module.exports = {
    getCategories: async (req, res) => {
        const cats = await Category.find();

        let categories = [];

        for(let i in cats) {
            categories.push({
                ...cats[i]._doc,
                img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
            });
        }

        res.json({categories});

    },
    addAction: async (req, res) => {
        let {title, price, priceNegotiable, description, cat, token} = req.body;

        const user = await User.findOne({token}).exec();

        if (!title || !cat) {
            res.json({error: 'Título e/ou categoria não foram preenchidos'});
        }

        if(price) {
            price = price.replace('.', '').replace(',', '.').replace('R$', '').trim();
            price = parseFloat(price);
        } else {
            price = 0;
        }

        const newAd = new Ad();

        newAd.status = true;
        newAd.idUser = user._id;
        newAd.state = user.state;
        newAd.dateCreated = new Date();
        newAd.title = title;
        newAd.category = cat;
        newAd.price = price;
        newAd.priceNegotiable = (priceNegotiable == 'true');
        newAd.description = description;
        newAd.views = 0;

        

    },
    getList: async (req, res) => {

    },
    getItem: async (req, res) => {

    },
    editAction: async (req, res) => {

    },

};
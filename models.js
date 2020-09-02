const mongoose = require("mongoose");

const hamSchema = new mongoose.Schema({
    ham : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number,
        soz : Number
    }
})

const yerSchema = new mongoose.Schema({
    yer : {
        puan : Number,
        tyt : Number,
        say : Number,
        ea : Number,
        soz : Number
    }
})

const hamYiginsal = mongoose.model("ham", hamSchema, '2019'); //ham - yığınsal tablo
const yerYiginsal = mongoose.model('yer', yerSchema, '2019'); //yerleştirme - yığınsal tablo


module.exports = {hamYiginsal, yerYiginsal};

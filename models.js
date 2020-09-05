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

//===================ÜNİVERSİTELER VERİTABANI
const uniSchema = new mongoose.Schema({
    kod : Number,
    tur : String
});
//==================

const hamYiginsal = mongoose.model("ham", hamSchema, '2019'); //ham - yığınsal tablo
const yerYiginsal = mongoose.model('yer', yerSchema, '2019'); //yerleştirme - yığınsal tablo
const uniModel = mongoose.model("tercih", {}, "2019_siralama");

module.exports = {hamYiginsal, yerYiginsal, uniModel};

var mongoose = require("mongoose");

// 로컬 데이터 베이스에 접속
mongoose.connect('mongodb://localhost:27017/userData', {useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;

// 맨 처음 연결
db.on('error', console.error.bind(console,'Connection Error:'));
db.once('open',function callback(){
    console.log('DB On!');
});

var User = new mongoose.Schema();

// 유저 스키마 생성
User.add({
    id: String,
    password: String,
    email: String,
    phone: String,
    age: Number,
    items: [String],
});

// 유저 스키마 전송
var userModel = mongoose.model('user',User);
exports.User = userModel;

// 물품 스키마 생성
var Item = new mongoose.Schema();

Item.add({
    name: String,
    place: String,
    date: Date,
});

// 물품 스키마 전송
var itemModel = mongoose.model('item',Item);
exports.Item = itemModel;
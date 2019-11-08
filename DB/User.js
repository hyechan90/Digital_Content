// 로컬 데이터 베이스에 접속
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userData', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;

// 맨 처음 연결
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function callback() {
  console.log('DB On!');
});

// 유저 스키마
var User = new mongoose.Schema({
  name: String,
  password: String,
  id: String,
  schoolId: String,
});

// 아이템 스키마
var Item = new mongoose.Schema({
  name: String,
  place: String,
  date: Date,
});

// 유저 스키마 전송
var userModel = mongoose.model('user', User);
exports.User = userModel;

// 아이템 스키마 전송
var itemModel = mongoose.model('item', Item);
exports.Item = itemModel;

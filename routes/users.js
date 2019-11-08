var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');
var app = express();

// DB/User 안에 있는 데이터들을 갖어옴
var { User, Item } = require('../DB/User');

// GET
app.get('/', (req, res) => {
  console.log('Server Running...');
  res.send('Server Running...');
});

// 모든 유저 반환
app.get('/get/User', (req, res) => {
  let time = req.query.time;
  // 1 = 오랜된 순
  // -1 = 최신순
  User.find({})
    .sort({ date: time })
    .exec((err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
});

app.get('/get/Item', (req, res) => {
  let time = req.query.time;
  // 1 = 오랜된 순
  // -1 = 최신순
  Item.find({})
    .sort({ date: time })
    .exec((err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
});

// POST

// 회원가입
app.post('/post/register', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const schoolId = req.body.schoolId;
  User.findOne({ email: email }, function(err, result) {
    if (err) throw err;
    if (result == null) {
      if (validateEmail(email)) {
        User.findOne({ schoolId: schoolId }, function(err, result) {
          if (err) throw err;
          User.findOne({ schoolId: schoolId });
          if (result == null) {
            //새로 만들때
            const user = new User({
              name: req.body.name,
              password: req.body.password,
              email: req.body.email,
              schoolId: req.body.schoolId,
            });
            user.save((err, result) => {
              if (err) throw err;
              console.log(result);
              res.send(result);
            });
          } else {
            // 이미 아이디 또는 계정이 있을 때
            console.log('이미 사용 중인 아이디가 있습니다.');
            res.status(404).send({ msg: '이미 사용 중인 아이디가 있습니다.' });
          }
        });
      } else {
        console.log('이메일 형식에 맞지 않습니다.');
        res.status(404).send({ msg: '이메일 형식에 맞지 않습니다.' });
      }
    } else {
      console.log('이미 사용 중인 계정이 있습니다.');
      res.status(404).send({ msg: '이미 사용 중인 계정이 있습니다.' });
    }
  });
});

// 유저 로그인
app.post('/post/login', (req, res) => {
  let login = new User({
    id: req.body.id,
    passwd: req.body.passwd,
  });
  User.findOne({ id: login.id }, function(err, result) {
    if (err) throw err;
    if (result != null) {
      // 만약 계정이 있을 때
      if (result.passwd != login.passwd) {
        // 만약 비밀번호가 틀렸을 때
        console.log('잘못된 비번입니다.');
        res.status(404).send({ msg: '잘못된 비번입니다.' });
      } else {
        console.log(result);
        res.send(result);
      }
    } else {
      console.log('없는 계정입니다.');
      res.status(404).send({ msg: '없는 계정입니다.' });
    }
  });
});

// 유저 삭제
app.post('/post/deleteUser', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  User.findOne({ id: id }).exec((err, result) => {
    if (err) throw err;
    console.log(result);
    console.log(result.id);
    if (result.id == id) {
      // 아이디 확인
      if (result.password == password) {
        // 비밀번호 확인
        User.deleteOne({ id: id }, (err, result) => {
          console.log(result);
          res.send(result);
        });
      } else {
        console.log('잘못된 비번입니다.');
        res.status(404).send({ msg: '잘못된 비번입니다.' });
      }
    } else {
      console.log('없는 아이디입니다.');
      res.status(404).send({ msg: '잘못된 비번입니다.' });
    }
  });
});

// 물품 등록
app.post('/post/addItem', (req, res) => {
  let id = req.body.id;
  User.findOne({ id: id }).exec((err, result) => {
    if (err) throw err;
    if (result != null) {
      result.update({ itemID: id }, (err, result) => {
        if (err) throw err;
        console.log(result);
      });
    } else {
      console.log('잘못된 값이 전달되었습니다.');
      res.status(500).send({ msg: '잘못된 값이 전달되었습니다.' });
    }
  });
});

app.post('/post/changeUser', (req, res) => {
  var id = req.body.id;
  User.findOne({ id: id }).exec((err, result) => {
    if (err) throw err;
    result.updateOne;
  });
});

// 이메일 서식에 맞는지 확인
function validateEmail(email) {
  var check = /\S+@\S+\.\S+/;
  return check.test(email);
}

module.exports = app;

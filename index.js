require("dotenv").config();
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const eje = require("ejs");
const app = express();
const firebase = require("firebase");
const id = require("uniqid");
const nodemailer = require("nodemailer");

var admin = require("firebase-admin");

var serviceAccount = require("./Firebase Keys/intern-data-firebase-adminsdk-c8haz-a1df0498de.json");
const { getMaxListeners } = require("process");
const DatabaseURL = process.env.URL;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${DatabaseURL}`,
});
const db = admin.firestore();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { data: { name: "Form Hanling" } });
});

app.post("/", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  email = req.body.email;
  phoneNo = req.body.phone;
  message = req.body.message;
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phone,
    message: req.body.message,
  };
  db.collection("Datas")
    .doc(id.process())
    .set(newUser)
    .then(() => {
      res.redirect("/");
      console.log("Data Added Success");
    });
  const UserLoginGmail = process.env.EMAIL;
  const AboveMailpassword = process.env.PASSWORD;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${UserLoginGmail}`,
      pass: `${AboveMailpassword}`,
    },
  });

  const mailOptions = {
    from: `${UserLoginGmail}`, // sender address
    to: `${email}`, // list of receivers
    subject: "Users", // Subject line
    html: `<h3>Name:${name}</h3><h3>PhoneNumber:${phoneNo}</h3><h3>Message:${message}</h3>`, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Mail Send");
    }
  });
});
const server = http.createServer(app);
PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server Running at the Port ${PORT}`);
});

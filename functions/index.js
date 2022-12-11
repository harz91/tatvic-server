const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/tatvic-demo", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://admin:%40er0Smitho9o1@tatvic-demo.sgh0ym7.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const api = functions.https.onRequest(app);

module.exports = {
  api,
};
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

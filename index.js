const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const PORT = process.env.PORT | 3000;

// bf6fc6086277ba3b60d16c2c6795b451-us10
// e76eca59bd

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const first_name = req.body.fName;
  const last_name = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: first_name,
          LNAME: last_name,
        }
      }
    ]
  };
  var json_data = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/e76eca59bd"
  const options = {
    method: "POST",
    auth: "eskevv:bf6fc6086277ba3b60d16c2c6795b451-us10",
  }

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    })
  });

  request.write(json_data);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});
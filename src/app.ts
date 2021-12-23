import express from "express";
import bp from "body-parser";
import qr from "qrcode";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.get("/qrCode", (req, res) => {
  res.send("hello world!");
});

app.post("/scan", (req, res) => {
  const url = req.body.url;

  // If the input is null return "Empty Data" error
  if (url.length === 0) res.send("Empty Data!");

  // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
  // It shall be returned as a png image format
  // In case of an error, it will save the error inside the "err" variable and display it

  qr.toDataURL(url, (err, src) => {
    if (err) res.send("Error occured");
    console.log(src);
    // Let us return the QR code image as our response and set it to be the source used in the webpage
    res.send(src);
  });
});

app.post("/terminal", (req, res) => {
  const stringdata = JSON.stringify(req.body.url);

  // If the input is null return "Empty Data" error
  if (stringdata.length === 0) res.send("Empty Data!");

  // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
  // It shall be returned as a png image format
  // In case of an error, it will save the error inside the "err" variable and display it

  qr.toString(stringdata, { type: "terminal" }, function (err, QRcode) {
    if (err) return console.log("error occurred");

    // Printing the generated code
    console.log(QRcode);
    res.send("ok");
  });
});

app.listen(port, () => {
  console.log(`example app is listening to ${port}`);
});

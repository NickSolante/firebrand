import express from "express";
import bp from "body-parser";
import qr from "qrcode";
import cors from "cors";
import { createConnection, getRepository } from "typeorm";
import { QrCode } from "./entity/QrCode";

const qrCodeCreation = async (url: string): Promise<string> => {
  return qr
    .toDataURL(url)
    .then((src) => {
      return src;
    })
    .catch((e) => {
      throw e;
    });
};

createConnection().then((connection) => {
  const app = express();
  const port = process.env.PORT || 3000;

  const qrCodeRepo = connection.getRepository(QrCode);

  app.set("view engine", "ejs");
  app.use(cors());
  app.use(bp.urlencoded({ extended: false }));
  app.use(bp.json());

  app.get("/qrCode", (req, res) => {
    res.send("hello world!");
  });

  app.post("/qrCode", async (req, res) => {
    const url = req.body.url;

    // If the input is null return "Empty Data" error
    if (url.length === 0) {
      res.send("Empty Data!");
    } else {
      const code = await qrCodeCreation(url);
      const qrCode = qrCodeRepo.create({ url, binaryImage: code });
      await qrCodeRepo.save(qrCode);
      res.send(code);
    }

    // Let us convert the input stored in the url and return it as a representation of the QR Code image contained in the Data URI(Uniform Resource Identifier)
    // It shall be returned as a png image format
    // In case of an error, it will save the error inside the "err" variable and display it
  });
  app.listen(port, () => {
    console.log(`example app is listening to ${port}`);
  });
});

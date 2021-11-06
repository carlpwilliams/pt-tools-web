import express from "express";
import { ProfitTrailer } from "./profitTrailer";
import config from "../config.json";
import { Discord } from "./discord";

const app = express();
const port = config.port;

let profitTrailer: ProfitTrailer;
let discord: Discord;

const ptLoaded = (pt: ProfitTrailer) => {
  console.info("pt reported it loaded!");
  discord = new Discord(pt);
  discord.start();
};

const init = () => {
  profitTrailer = new ProfitTrailer(ptLoaded);
};
app.use("/", express.static("public"));

app.get("/getpositions", async (req: any, res: any) => {
  console.info("get positions");
  const positions: any = await profitTrailer.getPositions();
  res.send(positions);
});

app.get("/durations", async (req: any, res: any) => {
  console.info("get trade times");
  const positions: any = await profitTrailer.getTradeDurations();
  res.send(positions);
});

app.listen(port, () => {
  if (config.optimisePTDB) {
    profitTrailer.prepareStats();
  }
  console.log(`Example app listening at http://localhost:${port}`);
});

init();

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Eth, Arb, Avax, Base, Bsc } from "./chainHandlers/mod.ts";
const kv = await Deno.openKv();
let tries = 0;
let totaltries = 0;
let timer = 0;
const Fetch = async () => {
  timer = Date.now();
  try {
    let EthData = await Eth();
    while (EthData[0] == undefined || EthData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      console.log("1/5...retrying ", tries);
      EthData = await Eth();
    }
    tries = 0;
    console.log("1/5 done");
    let ArbData = await Arb();
    while (ArbData[0] == undefined || ArbData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      console.log("2/5...retrying", tries);
      ArbData = await Arb();
    }
    tries = 0;
    console.log("2/5 done");
    let AvaxData = await Avax();
    while (AvaxData[0] == undefined || AvaxData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      console.log("3/5...retrying", tries);
      AvaxData = await Avax();
    }
    tries = 0;
    console.log("3/5 done");
    let BaseData = await Base();
    while (BaseData[0] == undefined || BaseData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      console.log("4/5...retrying", tries);
      BaseData = await Base();
    }
    tries = 0;
    console.log("4/5 done");
    let BscData = await Bsc();
    while (BscData[0] == undefined || BscData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      console.log("5/5...retrying", tries);
      BscData = await Bsc();
    }
    tries = 0;
    const time = Date.now() - timer;
    console.log(
      Date.now(),
      "task done in",
      time / 1000,
      "seconds with",
      totaltries,
      "retries"
    );
    const _data = [];
    // set kvs
    await kv.set(["daily-holders"], {

        eth: EthData[0],
        arb: ArbData[0],
        avax: AvaxData[0],
        base: BaseData[0],
        bsc: BscData[0],

    });
    await kv.set(["daily-transfers"], {

        eth: EthData[1],
        arb: ArbData[1],
        avax: AvaxData[1],
        base: BaseData[1],
        bsc: BscData[1],

    });
    console.log("kv writes done");
  } catch (error) {
    const timestamp = Date.now();
    console.log(timestamp, ": error");
    console.error(error);
  }
};

Deno.cron("Run every twelve hours", "0 */12 * * *", () => {
  Fetch();
});
const app = new Application();
const router = new Router();
app.use(oakCors());
const getDataByPrefix = async (ctx, prefix) => {
  const _data = [];
  const result = await kv.list({ prefix: [prefix] });
  for await (const { value } of result) {
    _data.push(value);
  }
  console.log(_data[0])
  return (ctx.response.body = _data[0]);
};
router.get("/v1/daily/holders", async (ctx) =>
  getDataByPrefix(ctx, "daily-holders")
);
router.get("/v1/daily/transfers", async (ctx) =>
  getDataByPrefix(ctx, "daily-transfers")
);
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8001 });

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Eth, Arb, Avax, Base, Bsc } from "./chainHandlers/mod.ts";
const kv = await Deno.openKv();
let totaltries = 0;
let timer = 0;
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const Fetch = async () => {
  timer = Date.now();
  try {
    console.log(timer);
    console.log("new task");
    // eth
    let timereth = Date.now();
    let EthData = await Eth();
    while (EthData[0] == undefined || EthData[1] == undefined) {
      totaltries += 1;
      EthData = await Eth();
      await delay(100);
    }
    const ethElapsed = Date.now() - timereth;
    console.log("eth-", ethElapsed / 1000, "s");

    // arb
    let timerarb = Date.now();
    let ArbData = await Arb();
    while (ArbData[0] == undefined || ArbData[1] == undefined) {
      totaltries += 1;
      ArbData = await Arb();
      await delay(100);
    }
    const arbElapsed = Date.now() - timerarb;
    console.log("arb-", arbElapsed / 1000, "s");

    // avax
    let timeravax = Date.now();
    let AvaxData = await Avax();
    while (AvaxData[0] == undefined || AvaxData[1] == undefined) {
      totaltries += 1;
      AvaxData = await Avax();
      await delay(100);
    }
    const avaxElapsed = Date.now() - timeravax;
    console.log("avax-", avaxElapsed / 1000, "s");

    // base
    let timerbase = Date.now();
    let BaseData = await Base();
    while (BaseData[0] == undefined || BaseData[1] == undefined) {
      totaltries += 1;
      BaseData = await Base();
      await delay(100);
    }
    const baseElapsed = Date.now() - timerbase;
    console.log("base-", baseElapsed / 1000, "s");

    // bsc
    let timerbsc = Date.now();
    let BscData = await Bsc();
    while (BscData[0] == undefined || BscData[1] == undefined) {
      totaltries += 1;
      BscData = await Bsc();
      await delay(100);
    }
    const bscElapsed = Date.now() - timerbsc;
    console.log("bsc-", bscElapsed / 1000, "s");

    // set kvs
    await kv.set(["chiffres"], {
      holders: {
        eth: EthData[0],
        arb: ArbData[0],
        avax: AvaxData[0],
        base: BaseData[0],
        bsc: BscData[0],
      },
      transfers: {
        eth: EthData[1],
        arb: ArbData[1],
        avax: AvaxData[1],
        base: BaseData[1],
        bsc: BscData[1],
      },
    });

    const time = Date.now() - timer;
    console.log("=============");
    console.log(Date.now());
    console.log("accomplished");
    console.log(time / 1000, "seconds");
    console.log(totaltries, "retries");
    console.log("=============");
    totaltries = 0;
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
  const result = await kv.get([prefix]);
  const data = result.value;
  return (ctx.response.body = data);
};
router.get("/v1/chiffres", async (ctx) => getDataByPrefix(ctx, "chiffres"));
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8001 });

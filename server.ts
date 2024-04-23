import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Eth, Arb, Avax, Base, Bsc } from "./chainHandlers/mod.ts";
const kv = await Deno.openKv();
let tries = 0;
let totaltries = 0;
let timer = 0;
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
const Fetch = async () => {
  timer = Date.now();
  try {
    console.log("")
    console.log("")
    console.log("=============")
    console.log(timer);
    console.log("  new task");
    console.log("=============")
    // eth
    console.log("________");
    console.log("Ethereum");
    let timereth = Date.now();
    let timereth2 = Date.now();
    let EthData = await Eth();
    while (EthData[0] == undefined || EthData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      EthData = await Eth();
      const time = Date.now() - timereth;
      console.log(tries, "in", (time / 1000).toFixed(1),"s");
      await delay(10);
      timereth = Date.now();
    }
    tries = 0;
    const ethElapsed = Date.now() - timereth2;
    console.log("--",ethElapsed/1000,"s");

    // arb
    console.log("________");
    console.log("Arbitrum");
    let timerarb = Date.now();
    let timerarb2 = Date.now();
    let ArbData = await Arb();
    while (ArbData[0] == undefined || ArbData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      ArbData = await Arb();
      const time = Date.now() - timerarb;
      console.log(tries, "in", (time / 1000).toFixed(1),"s");
      await delay(10);
      timerarb = Date.now();
    }
    tries = 0;
    const arbElapsed = Date.now() - timerarb2;
    console.log("--",arbElapsed/1000,"s");

    // avax
    console.log("________");
    console.log("Avalanche");
    let timeravax = Date.now();
    let timeravax2 = Date.now();
    let AvaxData = await Avax();
    while (AvaxData[0] == undefined || AvaxData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      AvaxData = await Avax();
      const time = Date.now() - timeravax;
      console.log(tries, "in", (time / 1000).toFixed(1),"s");
      await delay(10);
      timeravax = Date.now();
    }
    tries = 0;
    const avaxElapsed = Date.now() - timeravax2;
    console.log("--",avaxElapsed/1000,"s");

    // base
    console.log("________");
    console.log("Base Chain");
    let timerbase = Date.now();
    let timerbase2 = Date.now();
    let BaseData = await Base();
    while (BaseData[0] == undefined || BaseData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      BaseData = await Base();
      const time = Date.now() - timerbase;
      console.log(tries, "in", (time / 1000).toFixed(1),"s");
      await delay(10);
      timerbase = Date.now();
    }
    tries = 0;
    const baseElapsed = Date.now() - timerbase2;
    console.log("--",baseElapsed/1000,"s");

    // bsc
    console.log("________");
    console.log("Binance");
    let timerbsc = Date.now();
    let timerbsc2 = Date.now();
    let BscData = await Bsc();
    while (BscData[0] == undefined || BscData[1] == undefined) {
      tries += 1;
      totaltries += 1;
      BscData = await Bsc();
      const time = Date.now() - timerbsc;
      console.log(tries, "in", (time / 1000).toFixed(1),"s");
      await delay(10);
      timerbsc = Date.now();
    }   
    tries = 0;
    const bscElapsed = Date.now() - timerbsc2;
    console.log("--",bscElapsed/1000,"s");
    console.log("");
    console.log("=============");

    // set kvs
    await kv.set(["chiffres"], {
      holders:{
        eth: EthData[0],
        arb: ArbData[0],
        avax: AvaxData[0],
        base: BaseData[0],
        bsc: BscData[0],
      },
      transfers:{
        eth: EthData[1],
        arb: ArbData[1],
        avax: AvaxData[1],
        base: BaseData[1],
        bsc: BscData[1],
      }
    });

    const time = Date.now() - timer;
    console.log(
      Date.now(),
    );
    console.log("accomplished")
    console.log(time / 1000,"seconds")
    console.log(
      totaltries,
      "retries")
    console.log("=============");
    totaltries = 0;
    tries = 0;
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
  const data = result.value
  return (ctx.response.body = data);
};
router.get("/v1/chiffres", async (ctx) =>
  getDataByPrefix(ctx, "chiffres")
);
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8001 });

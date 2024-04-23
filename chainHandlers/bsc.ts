import { chainBaseREQ } from "../chainBaseREQ.tsx";
export async function Bsc() {
  const data = await chainBaseREQ(
    "https://api.chainbase.online/v1/token/holders?chain_id=56&contract_address=0x3419875b4d3bca7f3fdda2db7a476a79fd31b4fe&page=1&limit=20"
  );
  const data2 = await chainBaseREQ(
    "https://api.chainbase.online/v1/token/transfers?chain_id=56&contract_address=0x3419875B4D3Bca7F3FddA2dB7a476A79fD31B4fE&from_block=35660669&to_block=latest&page=1&limit=20"
  );
  return [data.count, data2.count];
}

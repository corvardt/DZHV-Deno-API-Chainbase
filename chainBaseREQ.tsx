export async function chainBaseREQ(url: string) {
    const options = {method: 'GET', headers: {accept: 'application/json', 'x-api-key': "demo"}}; // 2eVCL6vl7kwFoVMTGdTCZEtQd6i
    try {
      const response = await fetch(url, options)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
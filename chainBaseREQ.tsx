export async function chainBaseREQ(url: string) {
    const options = {method: 'GET', headers: {accept: 'application/json', 'x-api-key': "demo"}};
    try {
      const response = await fetch(url, options)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  
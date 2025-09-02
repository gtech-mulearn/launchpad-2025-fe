import axios from 'axios';
import Papa from 'papaparse';
export async function GET() {
    const { data } = await axios.get("https://docs.google.com/spreadsheets/d/1pWUKtmS3_9zUoXdrPe12Mx78zU_fpsSasc0VBOR1RXA/export?format=csv");
    const parsedData = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        transformHeader(header) {
            return header.toLowerCase().replace(/\W/g, '_');
        },
    });
    return new Response(JSON.stringify(parsedData.data), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=59,max-age=60'
        }
    });
}
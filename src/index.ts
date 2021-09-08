import express from 'express';
import * as profitTrailer from './profitTrailer';

const app = express()
const port = 3000


app.use('/', express.static('public'))

app.get('/getpositions', async (req: any, res: any) => {
  console.info('get positions');
  const positions: any = await profitTrailer.getPositions();
  res.send(positions);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
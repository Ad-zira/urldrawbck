/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { Request, Response } from 'express';
import * as randomstring from 'randomstring'
import { MongoClient } from 'mongodb'

const url = 'mongodb://mongoadmin:r1ck%40r0ll@127.0.0.1:27018'
const client = new MongoClient(url);
const dbName = 'rickandroll-url'

let collection;

const connectToDatabase = async () => {
  await client.connect();
  console.log('Connected to Database Server');

  const db = client.db(dbName);
  collection = db.collection('urls')   
}

connectToDatabase()
  .then(console.log)
  .catch(console.error)
  // .finally(() => client.close())

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to rickandroll! Yeah' });
});

app.post('/api/shorturl', async (req: Request, res: Response) => {
  const urlString = randomstring.generate(7);

  const newLink = {
    id: urlString,
    url: `http://localhost:3333/api/${urlString}`
  }
  const insertResult = await collection.insertOne(newLink)
  return res.json({...insertResult, result: newLink});
})

// receive string from database using path parameter (:)
app.get('/api/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const findResult = await collection.findOne({ id }) 

  if (findResult) {
    return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }

  return res.send('Nothing here, sorry')
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

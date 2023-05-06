const express = require('express');
const redis = require('redis');
const process = require('process')

const app = express();
const client = redis.createClient(6379, 'redis-server')
client.set('visits', 0);

app.get('/', (req, res) => {
  process.exit(0)
  client.get('visits', (err, visits) => {
    res.send('Number of visits ' + visits);
    client.set('visits', parseInt(visits) + 1);
  });
});

app.listen(8081, () => {
  console.log('listening on port 8081');
});
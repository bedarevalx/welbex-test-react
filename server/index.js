const express = require('express');
const cors = require('cors');

const rowRouter = require('./routes/row.routes');

const PORT = process.env.PORT || 8080;

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
  // methods: ['GET', 'POST', 'DELETE', 'PUT'],
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', rowRouter);

app.listen(PORT, () => console.log('listening on port: ' + PORT));

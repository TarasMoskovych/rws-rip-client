const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(express.json({ extended: false }));
app.use(cors({
  origin: process.env.PRODUCTION ? process.env.ORIGINS.split(' ') : '*',
}));

app.get('/api/echo', (req, res) => {
  res.send({ message: 'Hello, world!' })
});

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

module.exports = app;

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const { russianWarshipRipService } = require('./services/russianwarship-rip.service');
const { PushService } = require('./services/push.service');
const rwsRipService = new russianWarshipRipService();
const pushService = new PushService(rwsRipService);

app.use(express.json({ extended: false }));
app.use(cors({
  origin: process.env.PRODUCTION ? process.env.ORIGINS.split(' ') : '*',
}));

app.get('/', (req, res) => {
  res.send({
    status: 'OK',
    date: new Date(),
  });
});

app.get('/api/echo', (req, res) => {
  res.send({ message: 'Hello, world!' })
});

app.get('/api/statistic', rwsRipService.getData.bind(rwsRipService));

app.post('/api/subscription', pushService.addSubscription.bind(pushService));

// will be called by cronjob
app.get('/api/send-notification', pushService.sendNotification.bind(pushService));

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

module.exports = app;

const webpush = require('web-push');
const { JsonStorageService } = require('./json-storage.service');
const { UadataService } = require('./uadata.service');

class PushService {
  constructor() {
    this.storageService = new JsonStorageService();
    this.uaDataService = new UadataService();
    this.publicKey = 'BPluQCnBsVK0TrXMgahymWFOglkCTXq7kahgk6LNa0dfgznWbbN7enGRr6ZGicH8TGK2dy5IjAgU6w5wVxPsFHg';
    this.privateKey = process.env.PRIVATE_KEY || '';

    webpush.setVapidDetails(
      'mailto:https://uadata-client.vercel.app',
      this.publicKey,
      this.privateKey,
    );
  }

  async addSubscription(req, res) {
    const sub = req.body;
    const { authorization } = req.headers;

    if (authorization !== this.publicKey) {
      return res.status(403).send({ message: 'Valid public key is required' });
    }

    if (!sub?.endpoint) {
      return res.status(400).send({ message: 'Request body is not valid.' });
    }

    const subs = await this.storageService.getData();

    if (subs.find(({ endpoint }) => endpoint === sub.endpoint)) {
      return res.status(200).send({ message: 'Subscription already exists.' });
    } else {
      const payload = {
        title: 'Слава Україні!',
        icon: 'https://raw.githubusercontent.com/TarasMoskovych/uadata-client/main/src/assets/icons/Ukraine.png',
        btnTitle: 'Героям слава!'
      };

      subs.push(sub);

      this.storageService.saveData(JSON.stringify(subs))
        .then(() => webpush.sendNotification(sub, JSON.stringify(this._getNotificationPayload(payload))))
        .then(() => res.status(201).send({ message: 'Added subscription successfully.' }));
    }
  }

  async sendNotification(req, res) {
    const { token } = req.query;

    if (!token || token !== this.privateKey) {
      return res.status(403).send({ message: 'Valid token is required' });
    }

    const { title, body } = await this.uaDataService.getDailyUpdates();
    const subs = await this.storageService.getData();
    const payload = {
      title,
      body,
      icon: 'https://raw.githubusercontent.com/TarasMoskovych/uadata-client/main/src/assets/icons/icon-192x192.png',
    };

    Promise.all(subs.map(sub => webpush.sendNotification(sub, JSON.stringify(this._getNotificationPayload(payload)))))
      .then(() => res.status(200).json({ message: `Notification sent successfully to ${subs.length} subscribers.` }))
      .catch(err => res.status(500).send(err));
  }

  _getNotificationPayload({ title, body, icon, btnTitle = '👍' }) {
    return {
      notification: {
        title,
        body,
        icon,
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [{
          action: '',
          title: btnTitle,
        }],
      },
    };
  }
}

module.exports = { PushService };

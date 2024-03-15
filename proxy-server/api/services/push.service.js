const webpush = require('web-push');
const { JsonStorageService } = require('./json-storage.service');

class PushService {
  constructor(dataService) {
    this.storageService = new JsonStorageService();
    this.dataService = dataService;
    this.publicKey = process.env.PUBLIC_KEY;
    this.privateKey = process.env.PRIVATE_KEY;

    webpush.setVapidDetails(
      'mailto:https://rws-rip-client.vercel.app',
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
        icon: 'https://raw.githubusercontent.com/TarasMoskovych/rws-rip-client/main/src/assets/icons/Ukraine.png',
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

    const { title, body } = await this.dataService.getDailyUpdates();
    const subs = await this.storageService.getData();
    const expired = [];
    const payload = {
      title,
      body,
      icon: 'https://raw.githubusercontent.com/TarasMoskovych/rws-rip-client/main/src/assets/icons/icon-192x192.png',
    };

    Promise.all(subs.map(sub => webpush.sendNotification(sub, JSON.stringify(this._getNotificationPayload(payload))).catch(() => expired.push(sub))))
      .then(() => this._removeExpiredSubscriptions(subs, expired))
      .then(() => res.status(200).json({ message: `Notification sent to ${subs.length} subscribers.`, expiredEndpoints: expired.map((sub) => sub.endpoint) }))
      .catch(err => res.status(500).send(err));
  }

  async _removeExpiredSubscriptions(all, expired) {
    const subs = all.filter(({ endpoint }) => !expired.find(({ endpoint: expiredEndpoint }) => endpoint === expiredEndpoint));

    if (all.length !== subs.length) {
      await this.storageService.saveData(JSON.stringify(subs));
    }

    return subs;
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

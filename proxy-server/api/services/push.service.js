const webpush = require('web-push');
const { StorageService } = require('../database');

class PushService {
  constructor(dataService) {
    this.storageService = new StorageService();
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

    const subscription = await this.storageService.findSubscription({ endpoint: sub.endpoint });

    if (subscription) {
      return res.status(200).send({ message: 'Subscription already exists.' });
    } else {
      const payload = {
        title: 'Слава Україні!',
        icon: 'https://raw.githubusercontent.com/TarasMoskovych/rws-rip-client/main/src/assets/icons/Ukraine.png',
        btnTitle: 'Героям слава!'
      };

      this.storageService.addSubscription(sub)
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
    const subs = await this.storageService.getAllSubscriptions();
    const expired = [];
    const notificationBody = JSON.stringify(this._getNotificationPayload({
      title,
      body,
      icon: 'https://raw.githubusercontent.com/TarasMoskovych/rws-rip-client/main/src/assets/icons/icon-192x192.png',
    }));

    Promise.all(subs.map(sub => webpush.sendNotification(sub, notificationBody).catch(() => expired.push(sub))))
      .then(() => this._removeExpiredSubscriptions(expired))
      .then(() => res.status(200).json({ message: `Notification sent to ${subs.length} subscribers.`, expiredEndpoints: expired.map((sub) => sub.endpoint) }))
      .catch(err => res.status(500).send(err));
  }

  async _removeExpiredSubscriptions(expired) {
    for (const subscription of expired) {
      await this.storageService.deleteSubscription({ endpoint: subscription.endpoint });
    }
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

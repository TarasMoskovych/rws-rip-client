const fetch = require('node-fetch');

class UadataService {
  constructor() {
    this.root = 'https://uadata.net/ukraine-russia-war-2022';
    this.categories = [
      'people',
      'tanks',
      'bbm',
      'artilery',
      'rszv',
      'ppo',
      'planes',
      'helicopters',
      'bpla',
      'ships',
      'auto',
    ];
  }

  async getData(_, res) {
    Promise.all(this._getAllRequests())
      .then(this._parseResponse.bind(this))
      .then(data => res.send(data));
  }

  _getAllRequests() {
    return this.categories.map(category => {
      return fetch(`${this.root}/${category}.json`).then(res => res.json());
    });
  }

  _parseResponse(response) {
    const lastUpdated = response[0].data[response[0].data.length - 1].at;

    return {
      lastUpdated,
      currentDay: Math.round((new Date(lastUpdated).getTime() - new Date('Feb 24 2022 03:40:00').getTime()) / (1000 * 60 * 60 * 24)) + 1,
      data: response.map(({ title, long_title, data }, idx) => {
        return {
          id: this.categories[idx],
          title,
          long_title,
          total: data[data.length - 1].val,
          current: data[data.length - 1].val - data[data.length - 2].val,
        };
      }).sort((a, b) => b.current - a.current),
    };
  }
}

module.exports = { UadataService };

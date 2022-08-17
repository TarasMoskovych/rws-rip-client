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
    return response.map(({ title, long_title, data }) => {
      return {
        title,
        description: long_title,
        data: [data[data.length - 1], data[data.length - 2]],
      };
    });
  }
}

module.exports = { UadataService };

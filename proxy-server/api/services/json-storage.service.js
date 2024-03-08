const fetch = require('node-fetch');

class JsonStorageService {
  constructor() {
    this.dbUrl = process.env.DATABASE_URL || '';
  }

  async getData() {
    const request = await fetch(this.dbUrl);
    return await request.json();
  }

  async saveData(data) {
    await fetch(this.dbUrl, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
       },
    });
  }
}

module.exports = { JsonStorageService };

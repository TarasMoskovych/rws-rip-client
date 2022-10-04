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
    this.categoriesDictionary = {
      people: {
        singular: 'вбитий',
        plural: 'вбитих',
      },
      tanks: {
        singular: 'танк',
        plural: 'танків',
      },
      bbm: {
        singular: 'бойова машина',
        plural: 'бойових машин',
      },
      artilery: {
        singular: 'артилерійська система',
        plural: 'артилерійських систем',
      },
      rszv: {
        singular: 'ракетна система залпового вогню',
        plural: 'ракетних систем залпового вогню',
      },
      ppo: {
        singular: 'система протиповітряної оборони',
        plural: 'систем протиповітряної оборони',
      },
      planes: {
        singular: 'літак',
        plural: 'літаків',
      },
      helicopters: {
        singular: 'гелікоптер',
        plural: 'гелікоптерів',
      },
      bpla: {
        singular: 'безпілотний літальний апарат',
        plural: 'безпілотних літальних апаратів',
      },
      ships: {
        singular: 'корабель',
        plural: 'кораблів',
      },
      auto: {
        singular: 'одиниця автомобільної техніки',
        plural: 'одиниць автомобільної техніки',
      },
    };
    this.topCategoriesCount = 5;
  }

  async getData(_, res) {
    return Promise.all(this._getAllRequests())
      .then(this._parseResponse.bind(this))
      .then(data => res ? res.send(data) : data);
  }

  async getDailyUpdates() {
    const statistic = await this.getData();
    const categories = [];

    for (let idx = 0; idx < statistic.data.length; idx++) {
      if (categories.length === this.topCategoriesCount) {
        break;
      }

      const category = statistic.data[idx];

      if (category.current > 0) {
        categories.push(`${category.current} ${this._getItemShortDescription(category.id, category.current)}`);
      }
    }

   if (!categories.length) {
    const { total } = statistic.data.find(({ id }) => id === 'people');
    categories.push(`Загалом ${total} вбитих на ${statistic.currentDay} день війни`);
   }

   return {
    title: `Втрати армії окупанта на ${statistic.lastUpdated}`,
    body: categories.join(', '),
   };
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
        const current = data[data.length - 1].val - data[data.length - 2].val;

        return {
          id: this.categories[idx],
          title,
          long_title,
          total: data[data.length - 1].val,
          current: current > 0 ? current : 0,
        };
      }).sort((a, b) => b.current - a.current),
    };
  }

  _getItemShortDescription(id, value) {
    return value > 1 ? this.categoriesDictionary[id].plural : this.categoriesDictionary[id].singular;
  }
}

module.exports = { UadataService };

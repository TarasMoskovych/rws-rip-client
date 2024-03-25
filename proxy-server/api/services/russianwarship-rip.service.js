const fetch = require('node-fetch');

class russianWarshipRipService {
  constructor() {
    this.root = 'https://russianwarship.rip/api/v2';
    this.categoriesDictionary = {
      personnel_units: {
        singular: 'вбитий',
        plural: 'вбитих',
        title: 'Особовий склад',
      },
      tanks: {
        singular: 'танк',
        plural: 'танків',
        title: 'Танки',
      },
      armoured_fighting_vehicles: {
        singular: 'бойова машина',
        plural: 'бойових машин',
        title: 'Бойові машини',
      },
      artillery_systems: {
        singular: 'артилерійська система',
        plural: 'артилерійських систем',
        title: 'Артилерійські системи',
      },
      mlrs: {
        singular: 'ракетна система залпового вогню',
        plural: 'ракетних систем залпового вогню',
        title: 'РСЗВ',
      },
      aa_warfare_systems: {
        singular: 'система протиповітряної оборони',
        plural: 'систем протиповітряної оборони',
        title: 'ППО',
      },
      planes: {
        singular: 'літак',
        plural: 'літаків',
        title: 'Літаки',
      },
      helicopters: {
        singular: 'гелікоптер',
        plural: 'гелікоптерів',
        title: 'Гелікоптери',
      },
      uav_systems: {
        singular: 'безпілотний літальний апарат',
        plural: 'безпілотних літальних апаратів',
        title: 'БПЛА',
      },
      warships_cutters: {
        singular: 'корабель',
        plural: 'кораблів',
        title: 'Кораблі',
      },
      vehicles_fuel_tanks: {
        singular: 'одиниця автомобільної техніки',
        plural: 'одиниць автомобільної техніки',
        title: 'Автомобільна техніка',
      },
      special_military_equip: {
        singular: 'одиниця спец. техніки',
        plural: 'одиниць спец. техніки',
        title: 'Спец. техніка',
      },
      submarines: {
        singular: 'підводний човен',
        plural: 'підводних човнів',
        title: 'Підводні човни',
      },
      cruise_missiles: {
        singular: 'крилата ракета',
        plural: 'крилатих ракет',
        title: 'Крилаті ракети',
      },
      atgm_srbm_systems: {
        singular: 'ракетний комплекс',
        plural: 'ракетних комплексів',
        title: 'Ракетні комплекси',
      },
    };
    this.topCategoriesCount = 5;
  }

  async getData(_, res) {
    return Promise.all([this._getStatisticsLatest(), this._getTerms()])
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
      const { total } = statistic.data.find(({ id }) => id === 'personnel_units');
      categories.push(`Загалом ${total} вбитих на ${statistic.currentDay} день війни`);
    }

    return {
      title: `Втрати армії окупанта на ${statistic.lastUpdated}`,
      body: categories.join(', '),
    };
  }

  _getStatisticsLatest() {
    return fetch(`${this.root}/statistics/latest`)
      .then(response => response.json());
  }

  _getTerms() {
    return fetch(`${this.root}/terms/ua`)
      .then(response => response.json());
  }

  _parseResponse([statistic, terms]) {
    const { date, day, stats, increase } = statistic.data;

    return {
      lastUpdated: date,
      currentDay: day,
      data: Object.keys(stats).map(key => {
        const { title, icon } = terms.data[key];
        const customTitle = this._getItemCustomTitle(key, title);

        return {
          id: key,
          title: customTitle,
          long_title: title,
          icon,
          total: stats[key],
          current: Math.max(0, increase[key]),
        };
      }).sort((a, b) => b.current - a.current),
    };
  }

  _getItemShortDescription(id, value) {
    if (!this.categoriesDictionary[id]) {
      return id;
    }

    return value > 1 ? this.categoriesDictionary[id].plural : this.categoriesDictionary[id].singular;
  }

  _getItemCustomTitle(id, value) {
    if (!this.categoriesDictionary[id]) {
      return value;
    }

    return this.categoriesDictionary[id].title;
  }
}

module.exports = { russianWarshipRipService };

<template>
  <div class="wrapper">
    <initialization v-if="!hasSavedCities" @select-city="getSelectedCity" />
    <keep-alive>
      <settings
        v-if="isSettingsOn"
        @select-city="getSelectedCity"
        @settings-off="isSettingsOn = !isSettingsOn"
        @remove-city="getCityByRemove"
        @empty-localstorage="hasSavedCities = false"
      />
    </keep-alive>

    <div class="card" v-if="!isSettingsOn && hasSavedCities">
      <img
        class="card__settings"
        :src="require('../assets/images/gear.png')"
        @click="isSettingsOn = !isSettingsOn"
        alt="gear"
      />

      <h2 class="card__city">{{ getCity }}</h2>
      <div class="card__row card__row--temperature">
        <img class="card__img" :src="getImage" alt="weather img" srcset="" />
        <div class="card__temperature">{{ getTemperature }}&#176;C</div>
      </div>
      <div class="card__row">
        Feels like {{ getFeelsLike }}&#176;C. {{ getWeatherDescription }}.
      </div>
      <div class="card__row">
        <div class="card__col card__col--wind">
          {{ getWindSpeed }} {{ getWindDegree }}
        </div>
        <div class="card__col card__col--pressure">
          {{ getPressure }}
        </div>
      </div>
      <div class="card__row">
        <div class="card__col card__col--first">{{ getHumidity }}</div>
        <div class="card__col">{{ getVisibility }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Settings from "../components/Settings.vue";
import Initialization from "../components/Initialization.vue";

export default {
  name: "Card",

  components: {
    Settings,
    Initialization,
  },

  data() {
    return {
      city: "",
      country: "",
      temperature: "",
      feelsLike: "",
      weatherDescription: "",
      windSpeed: 0,
      windDegree: 0,
      pressure: 0,
      humidity: 0,
      visibility: 0,
      weatherMain: "",
      isSettingsOn: false,
      selectedCity: "",
      hasSavedCities: false,
    };
  },

  mounted() {
    if (window.localStorage.length) {
      this.hasSavedCities = true;
      this.selectedCity = this.getActiveCity;
      this.getData();
    }
  },

  updated() {
    this.getData();
  },

  methods: {
    getData() {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.selectedCity}&units=metric&appid=62ce58e25a320fc5b56a8afac29380de`
      )
        .then((response) => response.json())
        .then((data) => {
          this.city = data.name;
          this.country = data.sys.country;
          this.temperature = data.main.temp;
          this.feelsLike = data.main.feels_like;
          this.weatherDescription = data.weather[0].description;
          this.windSpeed = data.wind.speed;
          this.windDegree = data.wind.deg;
          this.pressure = data.main.pressure;
          this.humidity = data.main.humidity;
          this.visibility = data.visibility;
          this.weatherMain = data.weather[0].main;
        });
    },

    getSelectedCity(value) {
      this.hasSavedCities = true;
      this.selectedCity = value;
    },

    getCityByRemove(value) {
      this.selectedCity = value;
      this.getData();
    },
  },

  computed: {
    getCity() {
      return `${this.city}, ${this.country}`;
    },

    getTemperature() {
      return Math.round(this.temperature);
    },

    getFeelsLike() {
      return Math.round(this.feelsLike);
    },

    getWeatherDescription() {
      return (
        this.weatherDescription.charAt(0).toUpperCase() +
        this.weatherDescription.slice(1)
      );
    },

    getWindSpeed() {
      return `${this.windSpeed.toFixed(1)}m/s`;
    },

    getWindDegree() {
      if (this.windDegree < 22.5) return "N";
      if (this.windDegree < 67.5) return "NE";
      if (this.windDegree < 112.5) return "E";
      if (this.windDegree < 157.5) return "SE";
      if (this.windDegree < 202.5) return "S";
      if (this.windDegree < 247.5) return "SW";
      if (this.windDegree < 292.5) return "W";
      if (this.windDegree < 337.5) return "NW";
      if (this.windDegree >= 337.5) return "N";
      return "";
    },

    getPressure() {
      return `${this.pressure}hPa`;
    },

    getHumidity() {
      return `Humidity: ${this.humidity}%`;
    },

    getVisibility() {
      return `Visibility: ${(this.visibility / 1000).toFixed(1)}km`;
    },

    getActiveCity() {
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        const cityStorage = JSON.parse(localStorage[key]);
        if (cityStorage.isActive) {
          return cityStorage.city;
        }
      }
      return "";
    },

    getImage() {
      switch (this.weatherMain) {
        case "Snow":
          return require("../assets/images/snowy.png");
        case "Rain":
          return require("../assets/images/rain.png");
        case "Clouds":
          if (this.weatherDescription === "broken clouds") {
            return require("../assets/images/part-cloudy.png");
          } else {
            return require("../assets/images/cloudy.png");
          }
        case "Haze":
          return require("../assets/images/haze.png");
        default:
          return require("../assets/images/sunny.png");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/reset.css";

.wrapper {
  width: 260px;
  height: 340px;
  padding: 20px;
  position: relative;
}

.card {
  &__settings {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  &__city {
    font-weight: 700;
    margin-bottom: 30px;
  }

  &__row {
    display: flex;
    font-size: 14px;
    margin-bottom: 20px;
    line-height: 140%;
    align-items: center;

    &--temperature {
      justify-content: space-around;
      margin-bottom: 30px;
    }
  }

  &__img {
    width: 70px;
    height: 70px;
  }

  &__temperature {
    font-size: 50px;
    font-weight: 500;
  }

  &__col {
    display: flex;
    align-items: center;
    position: relative;

    &--first {
      margin-right: 10px;
    }

    &::before {
      position: absolute;
      left: 0;
      content: "";
    }

    &--wind {
      padding-left: 25px;
      margin-right: 20px;

      &::before {
        top: 0;
        background: url("../assets/images/arrow.png");
        background-size: cover;
        width: 15px;
        height: 15px;
        transform: rotate(225deg);
      }
    }

    &--pressure {
      padding-left: 25px;

      &::before {
        top: -5px;
        background: url("../assets/images/pressure.png");
        background-size: cover;
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>

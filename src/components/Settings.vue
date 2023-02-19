<template>
  <div class="settings">
    <div class="settings__close" @click="handleClose">
      <div class="settings__close--first"></div>
      <div class="settings__close--second"></div>
    </div>
    <h2 class="settings__title">Settings</h2>

    <draggable
      v-model="cities"
      class="settings__cities"
      @start="drag = true"
      @end="drag = false"
    >
      <li
        class="settings__city"
        v-for="(city, index) in cities"
        :key="index"
        @click.stop="handleChoice"
      >
        <div>
          <img
            class="settings__icon settings__icon--drag"
            src="../assets/images/drag.png"
            alt="drag"
          />
          <span>{{ city.city }}</span>
        </div>
        <img
          class="settings__icon settings__icon--trash"
          src="../assets/images/trash.png"
          alt="trash"
          @click.stop="removeCity"
        />
      </li>
    </draggable>

    <div class="settings__row">
      <div class="settings__placeholder" v-if="cities.length === 0">
        Add up to 4 cities<br />
        to this list
      </div>
    </div>

    <div class="settings__add-city">
      <h2 class="settings__title">Add location:</h2>
      <div class="settings__row">
        <input
          class="settings__input"
          type="text"
          v-model="currentCity"
          @keyup.enter="inputHandler"
        />
        <img src="../assets/images/enter.png" alt="add" @click="inputHandler" />
      </div>
    </div>
    <div class="settings__alert" v-if="wrongValue">Сity not found</div>
  </div>
</template>

<script>
import mainMixin from "../mixins/index";
import draggable from "vuedraggable";

export default {
  data() {
    return {
      cities: [],
      isSettings: true,
    };
  },

  components: {
    draggable,
  },

  mixins: [mainMixin],

  mounted() {
    this.getLocalStorage();
    this.checkCitiesLength(), this.updateActiveStyle(this.activeCity);
  },

  updated() {
    this.checkCitiesLength();
    this.updateLocalStorage();
    if (this.cities.length > 0) {
      this.updateActiveStyle(this.getActiveCity);
    }
  },

  methods: {
    addCity(value) {
      if (this.cities.length < 4) {
        this.cities.push(value);
        this.selectedCity = "";
        this.currentCity = "";
      }
    },

    handleChoice() {
      this.setActive();
      this.$emit("select-city", this.getCityValue());
    },

    setActive() {
      this.cities.forEach((el) => {
        el.isActive = false;
      });
      const activeCity = event.target
        .closest("li")
        .querySelector("span").innerHTML;
      const activeIndex = this.cities.findIndex((el) => el.city === activeCity);
      this.cities[activeIndex].isActive = true;

      this.updateActiveStyle(activeCity);

      this.updateLocalStorage();
    },

    updateActiveStyle(cityName) {
      let items = document.querySelectorAll(".settings__city");
      for (let item of items) {
        if (item.classList.contains("settings__city--active")) {
          item.classList.remove("settings__city--active");
        }
        if (item.querySelector("span").innerHTML === cityName) {
          item.classList.add("settings__city--active");
        }
      }
    },

    getCityValue() {
      let node = document.querySelector(".settings__city--active");
      return node.querySelector("span").innerHTML;
    },

    checkCitiesLength() {
      if (this.cities.length === 4) {
        const input = document.querySelector(".settings__input");
        input.setAttribute("disabled", true);
      }
    },

    removeCity(event) {
      const item = event.target.closest("li");
      const cityName = item.querySelector("span").innerHTML;
      let index;

      this.getLocalStorage();

      for (let i = 0; i < this.cities.length; i++) {
        if (this.cities[i].city === cityName) {
          index = i;
        }
      }
      if (this.cities[index].isActive) {
        this.cities.splice(index, 1);
        if (this.cities.length > 0) {
          this.cities[0].isActive = true;
          this.$emit("remove-city", this.cities[0].city);
        }
      } else {
        this.cities.splice(index, 1);
      }

      this.updateLocalStorage();
    },

    updateLocalStorage() {
      localStorage.clear();

      for (let i = 0; i < this.cities.length; i++) {
        localStorage[i] = JSON.stringify(this.cities[i]);
      }
    },

    handleClose() {
      if (this.cities.length && this.cities.find((el) => el.isActive)) {
        this.$emit("settings-off");
      }
    },

    getLocalStorage() {
      this.cities.splice(0);
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        const cityStorage = JSON.parse(localStorage[key]);
        this.cities.push({
          city: cityStorage.city,
          isActive: cityStorage.isActive,
        });
      }
    },
  },

  computed: {
    getActiveCity() {
      const activeCity = this.cities.find((el) => el.isActive);
      return activeCity.city;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/reset.css";

.settings {
  &__title {
    font-weight: 700;
  }

  &__add-city {
    font-size: 14px;
    position: absolute;
    bottom: 30px;
  }

  &__cities {
    margin-top: 20px;
    margin-bottom: 40px;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    & img {
      width: 20px;
      height: 20px;
      padding-top: 10px;
      cursor: pointer;
    }
  }

  &__row {
    position: relative;
    display: flex;
    justify-content: center;
  }

  &__placeholder {
    position: absolute;
    top: 60px;
    font-weight: bold;
    font-size: 14px;
    opacity: 0.4;
    text-align: center;
    line-height: 140%;
  }

  &__input {
    margin-top: 10px;
    margin-right: 10px;
    width: 180px;
    height: 20px;
    background-color: #fafafa;
    border: 0;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    transition: 0.3s box-shadow;

    &:hover {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    }

    &:focus {
      outline: none;
    }
  }

  &__city {
    background: #d7dddf;
    padding: 7px 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    border-radius: 5px;
    cursor: default;

    &--active {
      // background: #7b8ffd;
      border: 2px solid #7b8ffd;
    }

    & div {
      display: flex;
      align-items: center;

      & img {
        margin-right: 10px;
      }
    }

    & span {
      margin-top: 2px;
    }
  }

  &__icon {
    width: 15px;
    height: 15px;

    &--drag {
      cursor: move;
    }

    &--trash {
      cursor: pointer;
    }
  }

  &__alert {
    position: absolute;
    bottom: 10px;
    color: #f54d4d;
    font-size: 12px;
    font-weight: bold;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;

    &--first {
      position: relative;
      top: 2px;
      width: 15px;
      height: 2px;
      background: #000;
      transform: rotate(45deg);
    }

    &--second {
      width: 15px;
      height: 2px;
      background: #000;
      transform: rotate(-45deg);
    }
  }
}
</style>

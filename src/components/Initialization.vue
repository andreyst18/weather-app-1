<template>
  <div class="init">
    <div class="init__dialog">
      <h2 class="init__text">
        Hi! There are no saved cities.<br />
        Enter the name of the city below:
      </h2>
      <div class="init__row">
        <input
          class="init__input"
          type="text"
          v-model="currentCity"
          @keyup.enter="inputHandler"
        />
        <img src="../assets/images/enter.png" alt="add" @click="inputHandler" />
        <div class="init__alert" v-if="wrongValue">Сity not found</div>
      </div>
    </div>
  </div>
</template>

<script>
import mainMixin from "../mixins/index";

export default {
  data() {
    return {
      isSettings: false,
    };
  },

  mixins: [mainMixin],
};
</script>

<style lang="scss" scoped>
@import "../styles/reset.css";

.init {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgb(181, 216, 233);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 30px;

  &__text {
    text-align: center;
    line-height: 140%;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  &__row {
    position: relative;

    & img {
      position: absolute;
      right: 0;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }

  &__input {
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

  &__alert {
    position: absolute;
    bottom: -20px;
    color: #f54d4d;
    font-size: 12px;
    font-weight: bold;
  }
}
</style>

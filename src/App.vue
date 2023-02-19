<template>
  <div id="app">
    <card />
  </div>
</template>

<script>
import Card from "./components/Card.vue";

export default {
  name: "App",

  components: {
    Card,
  },
};
</script>

<style lang="scss">
body {
  font-family: "Roboto", sans-serif;
}
</style>

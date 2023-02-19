export default {
  data() {
    return {
      currentCity: "",
      selectedCity: "",
      wrongValue: false,
    };
  },

  methods: {
    async inputHandler() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.currentCity}&units=metric&appid=62ce58e25a320fc5b56a8afac29380de`
        );
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        this.selectedCity = `${data.name}, ${data.sys.country}`;

        if (window.localStorage.length < 4) {
          const selectedCity = this.selectedCity;
          localStorage[this.currentCity] = JSON.stringify({
            city: selectedCity,
            isActive: window.localStorage.length === 0,
          });
        }

        if (this.isSettings) {
          const newCity = JSON.parse(localStorage[this.currentCity]);
          console.log(newCity);
          this.addCity(newCity);
        } else {
          this.$emit("select-city", this.selectedCity);
        }
      } catch (error) {
        this.showWarning();
      }
    },

    showWarning() {
      this.wrongValue = true;
      setTimeout(() => {
        this.wrongValue = false;
      }, 1000);
    },
  },
};

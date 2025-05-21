<template>
  <v-card class="pb-4 mt-4" elevation="10">
    <!-- Título con fondo verde difuminado -->
    <v-card-title class="text-h5 mb-4 text-center font-weight-bold bg-secondary">
      <v-icon start icon="mdi-food"></v-icon>
      Calorías consumidas esta semana
    </v-card-title>

    <!-- Área de texto con fondo verde oscuro y fuente negra -->
    <v-card-text
      class="d-flex justify-center text-h4 font-weight-bold bg-secondary-darken-2 text-black"
      style="padding: 16px;"
    >
      {{ totalCalories }}
      <!-- Unidad “Cal” en verde claro -->
      <span class="text-h4 font-weight-bold text-light-green--text">
        &nbsp;Cal
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CaloriesMetricsCard',
  data() {
    return { totalCalories: 0 }
  },
  async created() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}foods/calories/since-last-monday`,
        { params: { userId: this.$store.state.main.user.userId } }
      )
      this.totalCalories = data.totalCalories
    } catch (e) {
      console.error('Error al cargar métricas de calorías semanal:', e)
    }
  }
}
</script>

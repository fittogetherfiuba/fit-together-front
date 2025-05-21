<template>
    <v-card
        class="pb-4 mt-4 mx-auto"
        elevation="10"
        max-width="500"
    >
        <!-- Título con fondo verde difuminado -->
        <v-card-title class="text-h5 mb-4 text-center font-weight-bold bg-secondary">
        <v-icon start icon="mdi-water"></v-icon>
        Agua consumida esta semana
        </v-card-title>

        <!-- Área de texto con fondo verde oscuro y fuente negra -->
        <v-card-text
            class="d-flex align-baseline justify-center text-h4 font-weight-bold bg-secondary-darken-2 text-black"
            style="padding: 16px;"
        >
            <span>{{ totalLiters }}</span>
            <span class="text-h4 font-weight-bold text-light-green--text">
                &nbsp;L
            </span>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WaterMetricsCard',
  data() {
    return { totalLiters: 0 }
  },
  async created() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}water/since-last-monday`,
        { params: { userId: this.$store.state.main.user.userId } }
      )
      this.totalLiters = data.totalLiters
    } catch (e) {
      console.error('Error al cargar métricas de agua semanal:', e)
    }
  }
}
</script>

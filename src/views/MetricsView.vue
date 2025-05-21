<template>
  <div class="pa-4 d-flex flex-column align-center">
    <WaterMetricsCard class="mb-4" />
    <CaloriesMetricsCard />
  </div>
</template>

<script>
import WaterMetricsCard    from '../components/WaterMetricsCard.vue'
import CaloriesMetricsCard from '../components/CaloriesMetricsCard.vue'

export default {
  name: 'MetricsView',
  components: {
    WaterMetricsCard,
    CaloriesMetricsCard
  }
}
</script>

<template>
  <div class="pa-4 grid gap-4">
    <WaterMetricsCard />
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

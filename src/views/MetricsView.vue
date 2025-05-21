<template>
  <div class="pa-4 d-flex flex-column align-center">
    <WaterMetricsCard class="mb-4" />
    <CaloriesMetricsCard class="mb-4" />
    <ActivitiesMetricsCard />
  </div>
</template>

<script>
import WaterMetricsCard      from '../components/WaterMetricsCard.vue'
import CaloriesMetricsCard   from '../components/CaloriesMetricsCard.vue'
import ActivitiesMetricsCard from '../components/ExercisesMetricsCard.vue'

export default {
  name: 'MetricsView',
  components: {
    WaterMetricsCard,
    CaloriesMetricsCard,
    ActivitiesMetricsCard
  }
}
</script>

<template>
  <div class="pa-4 d-flex flex-column align-center">
    <WaterMetricsCard class="mb-4" />
    <FoodsMetricCard class="mb-4" />
    <ActivitiesMetricsCard />
  </div>
</template>

<script>
import WaterMetricsCard      from '../components/WaterMetricsCard.vue'
import ActivitiesMetricsCard from '../components/ExercisesMetricsCard.vue'
import FoodsMetricCard from '../components/FoodsMetricCard.vue';

export default {
  name: 'MetricsView',
  components: {
    WaterMetricsCard,
    FoodsMetricCard,
    ActivitiesMetricsCard
  }
}
</script>

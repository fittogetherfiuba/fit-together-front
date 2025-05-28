<template>
  <div class="pa-4 d-flex flex-column align-center">
    <WaterMetricsCard :userId="$store.state.main.user.userId" class="mb-4" />
    <FoodsMetricCard :userId="$store.state.main.user.userId" class="mb-4" />
    <ActivitiesMetricsCard :userId="$store.state.main.user.userId" />
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

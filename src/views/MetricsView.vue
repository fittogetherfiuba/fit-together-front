<template>
  <div class="pa-4 d-flex flex-column align-center">
    <v-row justify="center" aling="center">
      <v-col cols="12" sm="8" md="10">
        <v-row justify="center" align="start">
          <v-col cols="12" sm="12" class="mb-4">
            <FoodsMetricCard :userId="$store.state.main.user.userId"  />
          </v-col>
          <v-col cols="12" sm="6" class="mb-4" >
            <WaterMetricsCard :userId="$store.state.main.user.userId" />
          </v-col>
          <v-col cols="12" sm="6" class="mb-4">
            <ActivitiesMetricsCard :userId="$store.state.main.user.userId" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
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

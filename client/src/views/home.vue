<template>
  <component :is="currentComponent"></component>
</template>

<script>
import Charity from './charity-home.vue'
import Individual from './volunteer-home.vue'
import { mapState} from "vuex";

export default {
  data() {
    return {
      currentComponent: null
    }
  },
  components: {
    Charity,
    Individual,
  },
  computed: {
    ...mapState({
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
    }),
  }, 
  created(){
    if(this.role=='user'){
      this.currentComponent = 'Individual'
    } else if (this.role=='charity'){
      this.currentComponent = 'Charity';
    }
  },
}
</script>
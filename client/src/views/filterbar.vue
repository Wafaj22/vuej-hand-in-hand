<template>
  <div class="left-filter">
    <div class="card-body filter-cards-view">
      <div class="product-filter">
        <h6 class="f-w-600">Causes</h6>
        <div class="checkbox-animated mt-0">
          <label class="d-block" v-for="(opportunity,index) in getCauses" :key="index">
            <input  @change="appliedFilter(opportunity.cause)" :value="opportunity.cause" v-model="applyFilter" 
            class="checkbox_animated" :id="opportunity.cause" type="checkbox">{{opportunity.cause | capitalize}}
          </label>
        </div>
      </div>
      <div class="product-filter slider-product">
        <h6 class="f-w-600">Skills</h6>
        <div class="checkbox-animated mt-0">
          <label class="d-block" v-for="(opportunity,index) in getSkills" :key="index">
            <input @change="appliedFilter(opportunity.skills)" class="checkbox_animated" :value="opportunity.skills" 
            v-model="applyFilter" :id="opportunity.skills" type="checkbox">{{opportunity.skills | capitalize}}                                  
          </label>
        </div>
      </div>
      <div class="product-filter">
        <h6 class="f-w-600">Charity</h6>
        <div class="checkbox-animated mt-0">
          <label class="d-block" v-for="(charity,index) in getCharity" :key="index">
            <input @change="appliedFilter(charity)" class="checkbox_animated" :value="charity" 
            v-model="applyFilter" :id="charity" type="checkbox"> {{charity | capitalize}}
          </label>
        </div>
      </div>
      <div class="product-filter">
        <h6 class="f-w-600">City</h6>
        <div class="checkbox-animated mt-0">
          <label class="d-block" v-for="(city,index) in getCities" :key="index">
            <input @change="appliedFilter(city)" class="checkbox_animated" :value="city" 
            v-model="applyFilter" :id="city" type="checkbox"> {{city | capitalize}}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">

.checkbox_animated {
  cursor: pointer;
  position: relative;
  margin: 0 1rem 0 0;
}

input[type="checkbox"]{
  margin-right:0.5rem;
}
</style>
<script>
import { mapGetters } from 'vuex'

export default {
    data() {
    return {
      filter: false,
      // value: [0, 450],
      applyFilter: []
    }
  },
    computed: {
    ...mapGetters({
      getCauses: 'opportunities/getCauses',
      getCharity: 'opportunities/getCharities',
      getSkills: 'opportunities/getSkills',
      getCities: 'opportunities/getCities'
    })
    },
    // mounted() {
    //  this.$emit('priceVal')
    // },
    methods: {
        isActive(filterItem) {
        return this.applyFilter.indexOf(filterItem) > -1
        },
        appliedFilter() {
        this.$emit('allFilters', this.applyFilter)
        },
        getImgUrl(path) {
        return require('../assets/images/'+path)
        }, 
    }
}
</script>

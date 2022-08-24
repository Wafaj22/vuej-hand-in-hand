<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid product-wrapper sidebaron">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Volunteers</h3>
          </div>
        </div>
      </div>
      <div class="product-grid" v-if="isFetching">
        <div class="feature-products">
          <div class="row">
            <div class="col-md-6 products-total">
              <div class="square-product-setting d-inline-block">
                <a class="icon-grid grid-layout-view" @click="gridView()">
                  <feather type="grid"></feather>
                </a>
              </div>
              <div class="square-product-setting d-inline-block">
                <a class="icon-grid m-0 list-layout-view" @click="listView()">
                  <feather type="list"></feather>
                </a>
              </div>
            </div>
            <div class="col-md-6">
              <div class="pull-right text-right">
                <span class="f-w-600 mr-2">Sort By</span>
                <div
                  class="select2-drpdwn-product select-options d-inline-block"
                >
                  <select
                    class="form-control btn-square"
                    name="select"
                    @change="onChangeSort($event)"
                  >
                    <option>Relevance</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3">
              <div class="product-sidebar">
                <div class="filter-section">
                  <div class="card">
                    <div class="card-header">
                      <h6 class="mb-0 f-w-600">
                        Filters
                        <span class="pull-right">
                          <i class="fa fa-chevron-down toggle-data"></i>
                        </span>
                      </h6>
                    </div>
                    <Slider
                      @allFilters="allfilter"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-9 col-sm-12">
              <form>
                <div class="form-group m-0">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="Search.."
                  />
                  <i class="fa fa-search"></i>
                </div>
              </form>
              <div class="col-sm-12">
                <div v-if="filterVolunteer.length == 0">
                  <div class="search-not-found text-center">
                    <p>
                      Sorry, We didn't find any results matching this search
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="product-wrapper-grid"
          :class="listViewEnabled ? 'list-view' : ''"
        >
          <div class="row">
            <div
              :class="[listViewEnabled ? 'col-xl-12' : 'col-xl-3 col-md-6']"
              v-for="(volunteer, index) in filterVolunteer"
              :key="index"
            >
              <div class="card">
                <div class="product-box">
                  <div class="product-img">
                    <!-- dummy image -->
                    <img
                      class="img-fluid"
                      :src="getImgUrl(volunteer.image)"
                      alt
                    />

                    <div class="product-hover">
                      <ul>
                        <router-link :to="'/chat/' + volunteer.user._id" >
                          <li>
                            <button class="btn" type="button">
                              <i class="fa fa-comment"></i>
                              Contact
                            </button>
                          </li>
                        </router-link>
                      </ul>
                    </div>
                  </div>

                  <div class="product-details">
                    <router-link
                      :to="'/volunteers/' + volunteer.user._id"
                    >
                      <h4>{{ volunteer.user.name}}</h4>
                    </router-link>
                    <p>
                      <i class="fa fa-map-marker mr-2"></i>
                      {{ volunteer.city }} , {{ volunteer.postcode}}
                    </p>
                    <p v-if="listViewEnabled">
                      {{ volunteer.about }}
                    </p>
                  </div>
                  <div v-if="listViewEnabled" class="other-details">
                    <h6 class="f-w-600">Interested In</h6>
                    <ul class="items">
                      <li
                        class="badge badge-secondary pull-right"
                        v-for="(c, i) in volunteer.causes"
                        :key="i"
                        v-text="c"
                      ></li>
                    </ul>
                  </div>
                  <div v-if="listViewEnabled" class="other-details">
                    <h6 class="f-w-600">Skills</h6>
                    <ul class="items">
                      <li
                        class="badge badge-primary pull-right"
                        v-for="(c, i) in volunteer.skills"
                        :key="i"
                        v-text="c"
                      ></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.product-wrapper-grid {
  min-height: 1000px;
}

.product-wrapper-grid.list-view .product-box .product-details {
  width: 50%;
}

.product-wrapper-grid.list-view .product-box .other-details {
  width: 30%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}

.items {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
}

.badge {
  flex: 0 0 30%;
  margin: 5px;
  font-size: 90%;
  cursor: pointer;
}
.product-box .product-img .product-hover ul li {
  width: max-content;
}

.ribbon {
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  clear: left;
  position: absolute;
  top: 12px;
  left: 0px;
  color: #fff;
  z-index: 2;
}

.ribbon-danger {
  background: #dc3545;
}

</style>
  <script>
import { mapActions, mapGetters } from "vuex";
import Slider from "./filterVolunteer";
export default {
  name: "Volunteer",
  components: {
    Slider,
  },
  data() {
    return {
      isFetching: false,
      allfilters: [],
      filtered: true,
      listViewEnabled: false,
    };
  },
  computed: {
    ...mapGetters({filterVolunteer: "filterVolunteers", tags: "setTags"}),
  },
  async created(){
    await this.getVolunteers();
    this.isFetching = true;
  },
  methods: {  
    ...mapActions(["getVolunteers"]),
    //For getting image path
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },

    // For Order By
    onChangeSort(event) {
      this.$store.dispatch("sortVolunteers", event.target.value);
    },

    //Filter by Cause, Volunteer, Color
    allfilter(selectedVal) {
      this.allfilters = selectedVal;
      this.$store.dispatch("setTags", selectedVal);
    },

    listView() {
      this.listViewEnabled = true;
    },
    gridView() {
      this.listViewEnabled = false;
    },
  },
};
</script>

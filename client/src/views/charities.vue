<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid product-wrapper sidebaron">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Charities</h3>
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
                <div class="select2-drpdwn-product select-options d-inline-block">
                  <select class="form-control btn-square" name="select" @change="onChangeSort($event)">
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
                    <Slider @allFilters="allfilter" @priceVal="pricefilterArray" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-9 col-sm-12">
              <form>
                <div class="form-group m-0">
                  <input class="form-control" type="text" placeholder="Search.." />
                  <i class="fa fa-search"></i>
                </div>
              </form>
              <div class="col-sm-12">
                <div v-if="filterCharity.length == 0">
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
        <div class="product-wrapper-grid" :class="listViewEnabled ? 'list-view' : ''">
          <div class="row">
            <div :class="[listViewEnabled ? 'col-xl-12' : 'col-xl-3 col-md-6']" v-for="(charity, index) in filterCharity" :key="index">
              <div class="card">
                <div class="product-box">
                  <div class="product-img">

                    <img class="img-fluid" :src="getImgUrl(charity.image)" alt />

                    <div class="product-hover">
                      <ul>
                        <router-link :to="''">
                          <li v-if="role=='user'">
                            <button v-if="!isSupporting(charity._id)" class="btn" type="button" @click="support(charity)">
                              <i class="fa fa-heart mr-2"></i>
                              <span>Support</span>
                            </button>
                            <button v-else class="btn" type="button" @click="unsupport(charity)">
                              <i class="fa fa-times mr-2"></i>
                              <span>Unsupport</span>
                            </button>
                          </li>
                          <li v-else>
                            <button v-if="isCollaborating(charity._id)" class="btn" type="button" disabled>
                              <i class="fa fa-heart mr-2"></i>
                              <span>Collaborating</span>
                            </button>
                            <button v-else class="btn" type="button" @click="collaborate(charity)">
                              <i class="fa fa-heart mr-2"></i>
                              <span>Collaborate</span>
                            </button>
                          </li>
                        </router-link>
                      </ul>
                    </div>
                  </div>

                  <div class="product-details">
                    <router-link :to="'/charities/' + charity.user._id">
                      <h4>{{ charity.user.name }}</h4>
                    </router-link>
                    <p>
                      <i class="fa fa-map-marker mr-2"></i>
                      {{ charity.city }} , {{ charity.postcode}}
                    </p>
                    <p v-if="listViewEnabled">
                      {{ charity.mission }}
                    </p>
                  </div>
                  <div v-if="listViewEnabled" class="other-details">
                    <h6 class="f-w-600">Causes</h6>
                    <ul class="items">
                      <li class="badge badge-secondary pull-right" v-for="(c, i) in charity.cause" :key="i" v-text="c"></li>
                    </ul>
                  </div>
                  <div v-if="listViewEnabled" class="other-details">
                    <h6 class="f-w-600">Contact</h6>
                    <ul class="items">
                      <li v-if="charity.website">
                        <i class="fa fa-check-circle mr-2 mb-4"></i><a :href="'https://'+charity.website" target="_blank">{{ charity.website }}</a>
                      </li>
                      <li v-else>
                        <i class="fa fa-check-circle mr-2 mb-4"></i><i>No website</i>
                      </li>
                      <li v-if="charity.facebook">
                        <i class="fa fa-facebook mr-2 mb-4"></i><a :href="'https://www.facebook.com/'+charity.facebook" target="_blank">{{ charity.facebook }}</a>
                      </li>
                      <li v-else>
                        <i class="fa fa-facebook mr-2 mb-4"></i><i>No facebook account</i>
                      </li>
                      <li  v-if="charity.instagram">
                        <i class="fa fa-instagram mr-2 mb-4"></i><a :href="'https://www.instagram.com/'+charity.instagram" target="_blank">{{charity.instagram}}</a>
                      </li>
                      <li v-else>
                        <i class="fa fa-instagram mr-2 mb-4"></i><i>No instgram account</i>
                      </li>
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
  width: 40%;
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
import { mapGetters, mapActions, mapState } from "vuex";
import Slider from "./filterCharity";
export default {
  name: "Volunteer",
  components: {
    Slider,
  },
  data() {
    return {
      clicked: false,
      isFetching: "",
      allfilters: [],
      filtered: true,
      listViewEnabled: false,
      supporting: [],
      collaborators: [],
    };
  },
  computed: {
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      charity: (state) => state.charities.charityProfile,  
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
    }), //volunteer: volunteerProfile
    ...mapGetters({
      filterCharity: "charities/filterCharities",
      tags: "charities/setTags",
    }),
  },
  async created() {
    try {
      await this["charities/getCharities"]();      
      this.checkRole();
      this.isFetching = true;
    } catch (error) {
      console.log("unable to retrieve volunteer");
    }
  },
  methods: {
    ...mapActions([
      "charities/getCharities",
      "charities/updateCharity",
      "updateVolunteer",
      "getVolunteerById",
      "charities/getCharityById"
    ]),
    checkRole() {
      if (this.role == "user") {
        this.getVolunteerById(this.id).then((res)=>{
          if(res.data.success){
            if(res.data.user!=null){
              this.supporting = res.data.user.charities              
            }
          }
        });        
      } else this["charities/getCharityById"](this.id).then((res)=>{
          if(res.data.success){
            if(res.data.user!=null){
              this.collaborators = res.data.user.connection              
            }
          }
      })
    },
    isSupporting(id) {
      if (this.role =='user') {
        if (this.supporting.length >= 1) {
          let a = this.supporting.map((a) => a._id);
          return a.includes(id) ? true : false;
        } else {
          return false;
        }
      } else {
        return false
      }
    },
    isCollaborating(id) {
      if (this.role =='charity') {
        console.log(this.collaborators)
        if (this.collaborators.length >= 1) {
          let a = this.collaborators.map((a) => a._id);
          return a.includes(id) || id==this.charity._id ? true : false;
        } else {
          return false;
        }
      } else {
        return false
      }
    },
  support(charity) {
      if (this.volunteer) {
        let v = this.volunteer.charities.map(a => a._id);
        let c = charity.supporter;

        if (v.indexOf(charity._id) === -1)
          v.push(charity._id);

        if (c.indexOf(this.volunteer._id) === -1)
          c.push(this.volunteer._id);

        console.log('charity array', c)
        console.log('volunteer array', v)

        let req = {
          user: { charities: v },
          id: this.id,
        };

        this.updateVolunteer(req).then((res) => {
          if (res.data.success) {
            console.log('re1',req);
            let req2 = {
              user: { supporter: c },
              id: charity.user._id,
            };
            console.log('req2',req2);
            this["charities/updateCharity"](req2).then((res) => {
              if (res.data.success) {
                this.$swal({
                  title: "Successfully Supported!",
                  icon: "success",
                });
                setTimeout(function(){ location.reload(); }, 3000);       
              }
            });
          }
        });
      } else {
        this.$swal({
          title: "Unauthorized to support charities!",
          text: "Complete your volunteer profile first",
          confirmButtonText: "Redirect to profile",
          confirmButtonColor: "#4466f2",
          icon: "warning",
        }).then((result) => {
          if (result.value) {
            this.$router.push("/profile");
          }
        });
      }
    },
    unsupport(charity) {
      if (this.volunteer.user) {

        let v = this.volunteer.charities.map(a => a._id);
        let c = charity.supporter;

        let supporting = v.filter(
          (item) => item !== charity._id
        );
        let supporter = c.filter(
          (item) => item !== this.volunteer._id
        );

        console.log('charity array', supporter)
        console.log('volunteer array', supporting)

        let req = {
          user: { charities: supporting },
          id: this.id,
        };

        this.updateVolunteer(req).then((res) => {
          if (res.data.success) {
            console.log('req1',req);
            let req2 = {
              user: { supporter: supporter },
              id: charity.user._id,
            };
            console.log('req2',req2);
            this["charities/updateCharity"](req2).then((res) => {
              if (res.data.success) {
                charity.supporter = charity.supporter.filter(
                  (item) => item !== this.volunteer._id
                );
                this.$swal({
                  title: "Successfully unsupported!",
                  icon: "success",
                });
                setTimeout(function(){ location.reload(); }, 3000);  
              }
            });
          }
        });
      } else {
        this.$swal({
          title: "Unauthorized to support charities!",
          text: "Create your profile first",
          icon: "warning",
        });
      }
    },
    collaborate(charity) {
      if(this.charity) {
        if (this.charity.user) {
          let v = this.charity.connection.map(a => a._id);
          let c = charity.connection;

          console.log('clicked', charity)
          console.log('logged in', this.charity)

          if (v.indexOf(charity._id) === -1)
            v.push(charity._id);
          if(c.indexOf(this.charity._id)=== -1)
            c.push(this.charity._id)

          let req = {
            user: { connection: v},
            id: this.id,
          };

          this["charities/updateCharity"](req).then((res) => {
            if (res.data.success) {
              console.log(req);
              let req2 = {
                user: { connection: c },
                id: charity.user._id,
              };
              console.log(req2);
              this["charities/updateCharity"](req2).then((res) => {
                if (res.data.success) {
                  this.$swal({
                    title: "Successfully Connected!",
                    icon: "success",
                  });
                  setTimeout(function(){ location.reload(); }, 3000); 
                }
              });
            }
          });
        } else {
          this.$swal({
            title: "Unauthorized to collaborate with charities!",
            text: "Create your profile first",
            confirmButtonText: "Redirect to profile",
            confirmButtonColor: "#4466f2",
            icon: "warning",
          }).then((result) => {
            if (result.value) {
              this.$router.push("/profile");
            }
          });
        }
      } else {
        this.$swal({
          title: "Unauthorized to collaborate with charities!",
          text: "Create your profile first",
          confirmButtonText: "Redirect to profile",
          confirmButtonColor: "#4466f2",
          icon: "warning",
        }).then((result) => {
          if (result.value) {
            this.$router.push("/profile");
          }
        });
      }
    },
    //For getting image path
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    // For Order By
    onChangeSort(event) {
      this.$store.dispatch("charities/sortCharities", event.target.value);
    },
    //Filter by Cause, Charity, Color
    allfilter(selectedVal) {
      this.allfilters = selectedVal;
      this.$store.dispatch("charities/setTags", selectedVal);
    },
    //Price Filter
    pricefilterArray(item) {
      this.$store.dispatch("charities/priceFilter", item);
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

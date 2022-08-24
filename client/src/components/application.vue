<template>
  <!-- Vertically centered Modal Component -->
  <b-modal @hidden="toggleModal()" ref='my-modal' size="lg" hide-footer centered title="Review volunteering applications" class="theme-modal">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(a, index) in details" :key="index">
        <div class="row mb-50 m-l-10">
          <div class="user-image">
            <img class="img-110 rounded-circle" :src="getImgUrl(a.details.image)">
          </div>
          <div class="col">
            <h3 class="mt-20">{{a.details.name}}</h3>
            <p>{{a.details.username}}</p>
          </div>
        </div>
        <div class="mb-50 m-l-10">
          <div class="form-group">
            <h6 class="form-label">Skills</h6>
            <ul v-if="a.details.skills" class="items">
              <li class="badge badge-secondary pull-right" v-for="(c, i) in a.details.skills" :key="i" v-text="c"></li>
            </ul>
            <ul v-else class="items">
              <li class="badge badge-secondary pull-right">No skills added</li>
            </ul>
          </div>
          <div class="form-group">
            <h6 class="form-label">Causes</h6>
            <ul v-if="a.details.causes" class="items">
              <li class="badge badge-secondary pull-right" v-for="(c, i) in a.details.causes" :key="i" v-text="c"></li>
            </ul>
            <ul v-else class="items">
              <li class="badge badge-secondary pull-right">No causes added</li>
            </ul>
          </div>
          <div v-if="a.details.about" class="form-group">
            <h6 class="form-label">About me</h6>
            <p>{{a.details.about}}</p>
          </div>
          <div v-if="a.details.description" class="form-group">
            <h6 class="form-label">Volunteering Experience</h6>
            <p>{{a.details.description}}</p>
          </div>
          <div v-if="a.details.portfolio" class="form-group">
            <i class="fa fa-briefcase mr-2"></i><label class="form-label">Portfolio website</label>
            <p class="form-control">{{a.details.portfolio}}</p>
          </div>
          <div v-if="a.details.linkedin" class="form-group">
            <i class="fa fa-linkedin mr-2"></i><label class="form-label">LinkedIn</label>
            <p class="form-control" type="text">{{a.details.linkedin}}</p>
          </div>
          <hr />
          <button class="btn btn-success m-r-10 cart-btn-transform" @click="approve(a)"><i class="fa fa-check-circle mr-1"></i>Approve application</button>
          <button class="btn btn-primary m-r-10" @click="disapprove(a._id)" disabled>Disapprove application</button>
        </div>
      </swiper-slide>
      <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>      
    </swiper>
  </b-modal>

</template>

<script>
import { mapActions, mapState } from "vuex";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  props: ["details", "index"],
  data() {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }, //pass as a prop from login page
    ...mapState({
      volunteer: (state) => state.volunteers.volunteerProfile,
      id: (state) => state.auth.id,
      role: (state) => state.auth.role,
    }),
  },
  components: {
    swiper,
    swiperSlide,
  },
  mounted() {
    this.showModal();
  },
  methods: {
    ...mapActions([
      "application/createApplication",
      "opportunities/updateOpportunity",
    ]),
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    toggleModal() {
      this.$emit("toParent", this.index);
    },
    disapprove() {
      console.log("disapprove");
    },
    approve(a) {
      console.log("approved");
      console.log("event", a.event);
      console.log("applicant", a.applicant);

      this.$refs["my-modal"].hide();
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper-pagination-bullet {
  width: 12px;
  height: 12px;
}
</style>
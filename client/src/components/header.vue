<template>
  <div class="header-wrapper row m-0">
    <form
      class="form-inline search-full"
      action="#"
      method="get"
      :class="{ open: true }"
    >
      <div class="form-group w-100">
        <div class="Typeahead Typeahead--twitterUsers">
          <div class="u-posRelative">
            <input
              class="demo-input Typeahead-input form-control-plaintext w-100"
              type="text"
              v-on:keyup="searchterm"
              v-model="terms"
              placeholder="Search .."
              name="q"
              title=""
              autofocus
            />
            <feather
              class="close-search"
              type="x"
              @click="removeFix()"
            ></feather>
          </div>
          <div
            :class="searchResult ? 'Typeahead-menu is-open' : 'Typeahead-menu'"
            v-if="menuItems.length"
          >
            <div
              class="ProfileCard u-cf"
              v-for="(menuItem, index) in menuItems.slice(0, 8)"
              :key="index"
            >
              <div class="ProfileCard-avatar header-search"></div>
              <div class="ProfileCard-details">
                <div class="ProfileCard-realName">
                  <span @click="removeFix()"
                    ><router-link
                      :to="{ path: menuItem.path }"
                      class="realname"
                      >{{ menuItem.title }}</router-link
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            :class="
              searchResultEmpty ? 'Typeahead-menu is-open' : 'Typeahead-menu'
            "
          >
            <div class="tt-dataset tt-dataset-0">
              <div class="EmptyMessage">
                Your search turned up 0 results. Opps There are no result found.
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="header-logo-wrapper">
      <div class="logo-wrapper">
        <router-link to="/">
          <img class="img-fluid" src="../assets/images/logo.png" alt />
        </router-link>
      </div>
      <div class="toggle-sidebar">
        <feather
          class="status_toggle middle sidebar-toggle"
          type="sliders"
          id="sidebar-toggle"
        ></feather>
      </div>
    </div>
    <div class="nav-right col-12 pull-right right-header p-0">
      <ul class="nav-menus">
        <li class="onhover-dropdown"  v-if="isLoggedIn">
          <div class="notification-box">
            <feather type="bell"></feather
            ><span class="badge badge-pill badge-secondary" style="right: -9px; top: -12px;">{{notifications.length}}</span>
          </div>
          <ul class="notification-dropdown onhover-show-div">
            <li>
              <feather type="bell"></feather>
              <h6 class="f-18 mb-0">Notitications</h6>
            </li>
            <li>
              <p v-for="(i, index) in notifications" :key="index">
                <i class="fa fa-circle-o mr-3 font-primary"> </i>{{i.message}}<span class="pull-right">{{i.time}}</span>
              </p>
            </li>
            <!-- <li>
              <a class="btn btn-primary" href="#">Check all notification</a>
            </li> -->
          </ul>
        </li>
        <li class="onhover-dropdown"  v-if="isLoggedIn">
          <div class="notification-box">
            <feather type="message-square"></feather>
            <span class="badge badge-pill badge-secondary" style="right: -23px; top: -12px;">Chat</span>
          </div>
          <ul class="chat-dropdown onhover-show-div">
            <li>
              <feather type="message-square"></feather>
              <h6 class="f-18 mb-0">Message Box</h6>
            </li>
            <li class="text-center">
              <router-link to="/chat" class="btn btn-primary" href="#"
                >View All
              </router-link>
            </li>
          </ul>
        </li>
        <li class="profile-nav onhover-dropdown p-0 mr-0">
          <div class="media profile-media" v-if="user">

            <img
              v-if="!isFetching && image!=null"
              style="height: 37px;"
              class="rounded-circle"
              :src='getImgUrl(image)'
              alt=""
            />
            <img
              v-if="image==null"
              style="height: 37px;"
              class="rounded-circle"
              src="../assets/images/user/profile.jpg"
              alt=""
            />
            <div class="media-body">
              <span>{{user.name}}</span>
              <p class="mb-0 font-roboto">
                {{user.username}}<i class="middle fa fa-angle-down"></i>
              </p>
            </div>
          </div>
          <div class="media profile-media" v-else>
            <img 
              style="height: 37px;"
              class="rounded-circle"
              src="../assets/images/user/profile.jpg"
              alt=""
            />
            <div class="media-body">
              <span>Welcome</span>
              <p class="mb-0 font-roboto">
                Register<i class="middle fa fa-angle-down"></i>
              </p>
            </div>
          </div>
          <ul class="profile-dropdown onhover-show-div">
            <li  v-if="isLoggedIn">
              <router-link to="/profile"
                ><feather type="user"></feather
                ><span>Profile</span></router-link
              >
            </li>
            <li v-else>
              <router-link to="/auth/login"
                ><feather type="user"></feather
                ><span>Login</span></router-link
              >
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="auth//register"
                ><feather type="edit"></feather
                ><span>Register</span></router-link
              >
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/chat"
                ><feather type="mail"></feather><span>Inbox</span></router-link
              >
            </li>
            <li v-if="isLoggedIn">
              <a to="/logout" @click.prevent="logoutUser" ><feather type="log-in"></feather><span>Log out</span></a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
var body = document.getElementsByTagName("body")[0];
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "Search",
  data() {
    return {
      isFetching: true,
      image: "",
      terms: "",
      searchResult: false,
      searchResultEmpty: false,
      notifications: []
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "user"]),
    ...mapState({ 
      menuItems: (state) => state.menu.searchData,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id
    }),
  },
  methods: {
    ...mapActions(["logout", "getProfile", "getVolunteerById", "charities/getCharityById", "notification/getNotificationById"]),
    logoutUser() {
      if(this.role=='user'){
        this.$cookie.delete('volunteer');
        this.$cookie.delete('volunteer-image');
      } else if (this.role =='charity'){
        this.$cookie.delete('charity');
        this.$cookie.delete('charity-image');
      }      
      this.logout();
    },
    searchterm: function () {
      this.$store.dispatch("menu/searchTerm", this.terms);
    },
    addFix() {
      body.classList.add("offcanvas");
      this.searchResult = true;
    },
    removeFix() {
      body.classList.remove("offcanvas");
      this.searchResult = false;
      this.terms = "";
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
  },
  async created() {
    this.getProfile()
    if(this.role=='charity'){
      this.image = this.$cookie.get('charity-image')
      await this["notification/getNotificationById"](this.id).then((res)=>{
        if(res.data.success){
          if(res.data.user!=null){
            this.notifications = res.data.user
            this.notifications.forEach((n)=>{
              let updateTime = moment(n.time).startOf('day').fromNow();
              n.time = updateTime
            })
          }
        }
      })
      this.isFetching = false
    } else if (this.role == 'user'){ 
      this.image = this.$cookie.get('volunteer-image')
      this.isFetching = false      
    } else {
      this.image == null
    }
  },
  watch: {
    "$i18n.locale"(to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
    menuItems: function () {
      this.terms ? this.addFix() : this.removeFix();
      if (!this.menuItems.length) this.searchResultEmpty = true;
      else this.searchResultEmpty = false;
    },
  },
};
</script>
<style lang='scss'>
  li >.badge{
    right: -8px;
    top: -9px;
  }

</style>
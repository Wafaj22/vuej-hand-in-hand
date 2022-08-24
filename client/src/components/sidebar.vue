<template>
  <div>
      <div class="logo-wrapper">
        <router-link to="/">
          <img
            class="img-fluid for-light"
            src="../assets/images/logo.png"
            alt="" />
        </router-link>
        <div class="toggle-sidebar" @click="toggle_sidebar">
            <feather class="status_toggle middle" type="grid" id="sidebar-toggle"></feather>
        </div>
      </div>
      <div class="logo-icon-wrapper">
        <router-link to="/">
          <img
            class="img-fluid"
            src="../assets/images/logo-icon.png"
            alt=""
        /></router-link>
      </div>
      <nav class="sidebar-main">
        <div id="sidebar-menu">
          <ul class="sidebar-links custom-scrollbar" id="myDIV"
          :style="[{'margin-left': margin+'px'}, {margin : '0px'}]"
          >
            <li class="back-btn">
              <router-link to="/">
                <img
                  class="img-fluid"
                  src="../assets/images/logo-icon.png"
                  alt=""
              /></router-link>
              <div class="mobile-back text-right">
                <span>Back</span
                ><i class="fa fa-angle-right pl-2" aria-hidden="true"></i>
              </div>
            </li>
           <li
                v-for="(menuItem, index) in menuItems"
                :key="index"
                :class="{'active': menuItem.active}"
                class="sidebar-list"
              >
                <!-- Sub -->
                <label
                      :class="'badge badge-'+menuItem.badgeType"
                      v-if="menuItem.badgeType"
                    >{{ menuItem.badgeValue }}</label>
                    <a
                  href="javascript:void(0)"
                  class="sidebar-link sidebar-title"
                  v-if="menuItem.type == 'sub'"
                  @click="setNavActive(menuItem, index)"
                >
                  <feather :type="menuItem.icon" class="top"></feather>
                  <span>
                    {{ menuItem.title }}
                  </span>
                  <div class="according-menu" v-if="menuItem.children">
                    <i class="fa fa-angle-right pull-right" ></i>
                  </div>
                </a> 
                <!-- Link -->
                <router-link
                  :to="menuItem.path"
                  class="sidebar-link sidebar-title"
                  v-if="menuItem.type == 'link' && !isRestricted(menuItem.title)"
                  router-link-exact-active
                >
                  <feather :type="menuItem.icon" class="top"></feather>
                  <span>
                    {{ (menuItem.title) }}
                  </span>
                  <i class="fa fa-angle-right pull-right" v-if="menuItem.children"></i>
                </router-link>                
                <!-- 2nd Level Menu -->
                <ul class="sidebar-submenu" v-if="menuItem.children" :class="{ 'menu-open': menuItem.active }">
                  <li
                    v-for="(childrenItem, index) in menuItem.children"
                    :key="index"
                    :class="{'active': childrenItem.active}"
                  >
                    <!-- Link -->
                    <router-link
                      class="submenu-title"
                      :to="childrenItem.path"
                      v-if="childrenItem.type == 'link'"
                      router-link-exact-active
                    >
                      {{ childrenItem.title }}
                      <label
                        :class="'badge badge-'+childrenItem.badgeType+' pull-right'"
                        v-if="childrenItem.badgeType"
                      >{{ childrenItem.badgeValue }}</label>
                      <i class="fa fa-angle-right pull-right mt-1" v-if="childrenItem.children"></i>
                    </router-link>
                  </li>
                </ul>
              </li>
          </ul>
        </div>
      </nav>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "Sidebar",
  data() {
    return {
      width: 0,
      height: 0,
      margin: 0,
      hideRightArrow: true,
      hideLeftArrow: true,
      menuWidth: 0,
      toggle_sidebar_var: false,
      clicked: false
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn", "id", "role"]),
    ...mapState({
      menuItems: state => state.menu.data})
  },
  mounted() {   
    this.menuItems.filter(items => {
      if (items.path === this.$route.path)
        this.$store.dispatch("menu/setActiveRoute", items);
      if (!items.children) return false;
      items.children.filter(subItems => {
        if (subItems.path === this.$route.path)
          this.$store.dispatch("menu/setActiveRoute", subItems);
      });
    });
  },
  methods: {
    toggle_sidebar() {
      this.$store.dispatch("menu/opensidebar");
    },
    setNavActive(item) {
      this.$store.dispatch("menu/setNavActive", item);
    },
    isRestricted(title){
      if(!this.isLoggedIn){
        return ['Profile', 'Chat'].includes(title) ? true : false
      }
      return false
    }
  }
};
</script>

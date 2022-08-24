<template>
  <div>
    <div class="page-wrapper" :class="'compact-wrapper'">
      <div class="page-header" :class="{ close_icon:!togglesidebar }">
        <Header @clicked="sidebar_toggle" />
      </div>
      <div class="page-body-wrapper" :class="'sidebar-icon'">
        <div class="sidebar-wrapper" :class="[{ close_icon : !togglesidebar }]">
          <Sidebar @clicked="sidebar_toggle" />
        </div>
        <div class="page-body">
          <transition name="fadeIn" enter-active-class="animated fadeIn">
           <router-view class="view"></router-view>
          </transition>
        </div>
        <Footer/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'

export default {
  name: 'mainpage',
  components:{
    Header,
    Sidebar,
    Footer
  },
  computed: {
    ...mapState({
      menuItems: state => state.menu.data,
      togglesidebar: (state) => state.menu.togglesidebar,
    })
  },
  watch:{
    '$route' (){
      this.menuItems.filter(items => {
        if (items.path === this.$route.path)
          this.$store.dispatch('menu/setActiveRoute', items)
        if (!items.children) return false
        items.children.filter(subItems => {
          if (subItems.path === this.$route.path)
            this.$store.dispatch('menu/setActiveRoute', subItems)
        })
      })
    },
    sidebar_toggle_var: function (){
      this.resized = (this.width <= 991) ? !this.sidebar_toggle_var : this.sidebar_toggle_var      
    }
  },
  methods:{
    sidebar_toggle(value) {
      this.sidebar_toggle_var = !value
    }
  }
}
</script>
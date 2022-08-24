<template>
  <div >
        <b-row>
          <b-col md="6">

            <b-input-group class="datatable-btn">
              <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>

          </b-col>

          <b-col md="6">
            <b-form-group label-cols="3" label="Per page" class="mb-0 datatable-select">
              <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="table-responsive datatable-vue m-t-20">
          <b-table select-mode="single" hover show-empty stacked="md" :items="items" :fields="tablefields" :filter="filter" :current-page="currentPage" :per-page="perPage" @filtered="onFiltered" selectable @row-selected="onRowSelected">
            <!-- A custom formatted column -->
            <template #cell(image)="data">
              <img class="img-50 rounded-circle" :src="getImgUrl(data.value)">
            </template>

            <!-- A custom formatted column -->
            <template #cell(causes)="data">              
              <span class="badge badge-secondary pull-right" v-for="(c, i) in data.value" :key="i" v-text="c"></span>
            </template>

            <!-- A custom formatted column -->
            <template #cell(skills)="data">              
              <span class="badge badge-primary pull-right" v-for="(c, i) in data.value" :key="i" v-text="c"></span>
            </template>

            <!-- A custom formatted column -->
            <template #cell(donations)="donation">              
              <b class="mr-2">{{donation.value.length}}</b><i class="fa fa-eye" @click="viewDonations(donation)"></i>
              <Donation v-if="donationsModal[donation.index]" :index="donation.index" :details="donations" @toParent="handler"></Donation>
            </template>

            <!-- A custom formatted column -->
            <template #cell(applications)="application">              
              <b class="mr-2">{{application.value.length}}</b><i class="fa fa-eye" @click="viewApplications(application)"></i>        
              <Application v-if="applicationModal[application.index]" :index="application.index" :details="applications" @toParent="handler"></Application>       
            </template>

            <!-- A custom formatted column -->
            <template #cell(volunteers)="data">              
              <span class="badge badge-secondary pull-right">{{data.value.length}}</span>
            </template>

          </b-table>
        </div>
        <b-col md="4" class="my-1">
          <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" class="my-0"></b-pagination>
        </b-col>


  </div>
</template>

<script>
import Application from "@/components/application.vue";
import Donation from "@/components/donation.vue";
export default {
  props: ["dataList", "role"],
  components: {
    Application,
    Donation
  },
  data() {
    return {
      tablefields: [],
      applicationModal: [],
      donationsModal: [],
      donations: [],
      applications: [],

      items: [],

      filter: null,

      totalRows: 1,
      currentPage: 1,
      perPage: 2,
      pageOptions: [2, 5, 8],
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.tablefields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },
  created() {
    if (this.role == "charity") {
      this.tablefields = [
        { key: "Image", label: "", sortable: false },
        { key: "Name", label: "Name", sortable: true },
        { key: "City", label: "City", sortable: true },
        { key: "Causes", label: "Causes", sortable: false },
      ];
    } else if (this.role == "volunteer") {
      this.tablefields = [
        { key: "Image", label: "", sortable: false },
        { key: "Name", label: "Name", sortable: true },
        { key: "City", label: "City", sortable: true },
        { key: "Causes", label: "Causes", sortable: false },
        { key: "Skills", label: "Skills", sortable: false },        

      ];
    } else if (this.role == "opportunity") {
      this.tablefields = [
        { key: "Image", label: "", sortable: false },
        { key: "Title", label: "Title", sortable: true },
        { key: "City", label: "City", sortable: true },
        { key: "Applications", label: "Applications", sortable: true },
        { key: "Volunteers", label: "Volunteers", sortable: true },
      ];
    } else if (this.role == "campaign") {
      this.tablefields = [
        { key: "Image", label: "", sortable: false },
        { key: "Title", label: "Title", sortable: true },
        { key: "City", label: "City", sortable: true },
        { key: "Donations", label: "Donations", sortable: true },
      ];
    }
    this.items = this.dataList;    
    this.applicationModal = new Array(this.items.length).fill(false);
    this.donationsModal = new Array(this.items.length).fill(false);
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    viewApplications(data){
      this.applications = data.item.Applications
      if(this.applications.length<1){
          this.$swal({
            title: "No Applications found",
            icon: "warning",
          });        
      } else {
        console.log(this.applications)
        this.$set(this.applicationModal, data.index, true);        
      }

    },
    handler(index) {
      this.$set(this.donationsModal, index, false);
      this.$set(this.applicationModal, index, false);      
    },
    viewDonations(index){
      this.donations= this.items[index].Donations
      this.$set(this.donationsModal, index, true);
    },
    onRowSelected(items) {
      if (this.role == "charity") {
        this.$router.push("/charities/"+items[0].id);
      } else if (this.role == "volunteer") {
        this.$router.push("/volunteers/"+items[0].id);
      } 
      // else if (this.role == "campaign") {
      //   this.$router.push("/campaigns/"+items[0].id);
      // } else if (this.role == "opportunity") {
      //   this.$router.push("/opportunities/"+items[0].id);
      // }
    },
  },
};
</script>
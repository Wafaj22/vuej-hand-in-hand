<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
        <!-- <div class="row">
             <div class="col-6 d-flex">
              <h3>Dashboard</h3>
            </div> 
          </div> -->
      </div>
      <div class="row" v-if="!isFetching">
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-blue static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="dollar-sign" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Total raised</span>
                  <h4 class="mb-0 counter">{{totalRaised}} $</h4>
                  <feather type="dollar-sign" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-orange static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="heart" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Campaigns</span>
                  <h4 class="mb-0 counter">{{charity.campaigns.length}}</h4>
                  <feather type="heart" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-pink static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="file-text" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Opportunities</span>
                  <h4 class="mb-0 counter">{{charity.opportunities.length}}</h4>
                  <feather type="file-text" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-sm-6 col-xl-3 col-lg-6">
          <px-card class="bg-purple static-top-widget-card">
            <div slot="with-padding">
              <div class="media static-top-widget">
                <div class="align-self-center text-center">
                  <feather type="users" class="middle"></feather>
                </div>
                <div class="media-body">
                  <span class="m-0">Volunteers</span>
                  <h4 class="mb-0 counter">{{nbVolunteers}}</h4>
                  <feather type="users" class="icon-bg"></feather>
                </div>
              </div>
            </div>
          </px-card>
        </div>
        <div class="col-xl-12 xl-100 chart_data_left box-col-12">
          <px-card>
            <div class="row m-0 chart-main">
              <div class="col-xl-3 col-md-6 col-sm-6 p-0 box-col-6">
                <div class="media align-items-center">
                  <div class="hospital-small-chart">
                    <div class="small-bar">
                      <div class="small-chart flot-chart-container">
                        <feather class="font-primary float-left ml-2" type="gift" style="width: 50px; height: 50px; margin-top: 10px;"></feather>
                      </div>
                    </div>
                  </div>
                  <div class="media-body">
                    <div class="right-chart-content">
                      <span>Total number of donations</span>
                      <h4>{{nbDonations}}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6 col-sm-6 p-0 box-col-6">
                <div class="media align-items-center">
                  <div class="hospital-small-chart">
                    <div class="small-bar">
                      <div class="small-chart1 flot-chart-container">
                        <feather class="font-primary float-left ml-2" type="percent"  style="width: 50px; height: 50px; margin-top: 10px;"></feather>
                      </div>
                    </div>
                  </div>
                  <div class="media-body">
                    <div class="right-chart-content">
                      <span>Average donation value</span>
                      <h4>{{average}}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6 col-sm-6 p-0 box-col-6">
                <div class="media align-items-center">
                  <div class="hospital-small-chart">
                    <div class="small-bar">
                      <div class="small-chart flot-chart-container">
                        <feather class="font-primary float-left ml-2" type="arrow-down"  style="width: 50px; height: 50px; margin-top: 10px;"></feather>
                      </div>
                    </div>
                  </div>
                  <div class="media-body">
                    <div class="right-chart-content">
                      <span>Lowest donation value</span>
                      <h4>{{lowest}}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-md-6 col-sm-6 p-0 box-col-6">
                <div class="media border-none align-items-center">
                  <div class="hospital-small-chart">
                    <div class="small-bar">
                      <div class="small-chart flot-chart-container">
                        <feather class="font-primary float-left ml-2" type="arrow-up"  style="width: 50px; height: 50px; margin-top: 10px;"></feather>
                      </div>
                    </div>
                  </div>
                  <div class="media-body">
                    <div class="right-chart-content">
                      <span>Highest donation value</span>
                      <h4>{{highest}}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </px-card>
        </div>

        <div class="col-md-12">
          <px-card title="Our Supporters">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Table :dataList="getSupporters()" role="volunteer" />
            </div>
          </px-card>
        </div>

        <div class="col-md-12">
          <px-card title="Our Collaborators">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Table :dataList="getConnections()" role="charity" />
            </div>
          </px-card>
        </div>

        <div class="col-md-12">
          <px-card title="Our Campaigns">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Table :dataList="getCampaigns()" role="campaign" />
            </div>
          </px-card>
        </div>

        <div class="col-md-12">
          <px-card title="Our Opportunities">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Table :dataList="getOpportunities()" role="opportunity" />
            </div>
          </px-card>
        </div>

        <div class="col-xl-6 col-md-12">
          <px-card title="Donation Methods">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Bar class="chart-height" :data="getDonationMethods()" />
            </div>
          </px-card>
        </div>
        <div class="col-xl-6 col-md-12">
          <px-card title="Donations History">
            <div slot="headerAction"></div>
            <div slot="with-padding">
              <Lines class="chart-height" :data="getDonationHistory()" />
            </div>
          </px-card>
        </div>

      </div>
    </div>
    <!-- Container-fluid Ends-->
  </div>
</template>

<style lang="scss" scoped>
.static-top-widget-card {
  border-radius: 15px;
  .card {
    background: transparent;
  }
}
.bg-blue {
  background-color: #69c7ff;
  color: white;
}
.bg-orange {
  background-color: #f78931;
  color: white;
}
.bg-purple {
  background-color: #7366ff;
  color: white;
}
.bg-pink {
  background-color: #f73164;
  color: white;
}

.chart_data_left {
  .card-body {
    .chart-main {
      .media {
        padding: 45px 40px;
        border-right: 1px solid #ecf3fa;

        .hospital-small-chart {
          align-items: center;
          margin-bottom: -25px;

          .small-bar {
            position: relative;
            margin-top: -50px;

            .flot-chart-container {
              height: 74px;
              width: 75px;

              svg {
                position: absolute;
                width: 100%;
                height: 95%;
              }
            }
          }
        }

        .media-body {
          .right-chart-content {
            margin-left: 30px;

            h4 {
              line-height: 1;
              font-weight: 500;
            }

            span {
              color: rgba(#2b2b2b, 0.7);
            }
          }
        }

        &.border-none {
          border-right: none;
        }
      }
    }
  }
}
</style>

<script>
import Lines from "./chartjs/Line";
import Bar from "./chartjs/Bar";
import Table from "@/components/datatable.vue";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      isFetching: true,
      highest: 0,
      average: 0,
      lowest: 0,
      nbDonations: 0,
      nbVolunteers: 0,
      totalRaised: 0,
    };
  },
  components: {
    Bar,
    Lines,
    Table,
  },
  computed: {
    ...mapState({
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile,
    }),
  },
  methods: {
    ...mapActions(["charities/getCharityById"]),
    count() {
      if (this.charity) {
        let v = this.charity.opportunities
          .map((opp) => opp.volunteers)
          .filter((volunteer) => Object.keys(volunteer).length !== 0);
        let d = this.charity.campaigns
          .filter((donation) => Object.keys(donation).length !== 0)
          .map((c) => c.donations);

        this.nbVolunteers = v.length;
        this.nbDonations = d.length >= 1 ? d[0].length : 0;
        this.totalRaised =
          d.length >= 1
            ? d[0].reduce((total, obj) => obj.amount + total, 0)
            : 0;
        if(d.length >= 1){
          this.highest = d[0].length >= 1 ? Math.max(...d[0].map((o) => o.amount), 0) : 0;
          this.lowest = d[0].length >= 1 ? Math.min(...d[0].map((o) => o.amount)) : 0;
        }
        this.average =
          this.nbDonations > 0 ? this.totalRaised / this.nbDonations : 0;
      } else {
        this.nbVolunteers = 90;
        this.nbDonations = 100;
      }
    },
    getMonth(createdAt) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthNames[new Date(createdAt).getMonth()];
    },
    getOpportunities() {
      let list = [];
      let opportunity = {};
      this.charity.opportunities.forEach((v) => {
        opportunity.id = v._id;
        opportunity.Title = v.title;
        opportunity.Image = v.image;
        opportunity.Applications = v.applications;
        opportunity.Volunteers = v.volunteers;
        opportunity.City = v.city;
        list.push(opportunity);
        opportunity = {};
      });
      console.log("opp", list);
      return list;
    },
    getCampaigns() {
      let list = [];
      let campaign = {};
      this.charity.campaigns.forEach((v) => {
        campaign.id = v._id;
        campaign.Title = v.title;
        campaign.Image = v.image;
        campaign.Donations = v.donations;
        campaign.City = v.city;
        list.push(campaign);
        campaign = {};
      });
      console.log("cam", list);
      return list;
    },
    getSupporters() {
      let list = [];
      let volunteer = {};
      this.charity.supporter.forEach((v) => {
        volunteer.id = v.user._id;
        volunteer.Name = v.user.name;
        volunteer.Image = v.image;
        volunteer.Causes = v.causes;
        volunteer.Skills = v.skills;
        volunteer.City = v.city;
        list.push(volunteer);
        volunteer = {};
      });
      console.log("supporters", list);
      return list;
    },
    getConnections() {
      let list = [];
      let charity = {};
      this.charity.connection.forEach((v) => {
        charity.id = v.user._id;
        charity.Name = v.user.name;
        charity.Image = v.image;
        charity.Causes = v.cause;
        charity.City = v.city;
        list.push(charity);
        charity = {};
      });
      console.log("connections", list);
      return list;
    },
    getDonationMethods() {
      let donations = [];
      this.charity.campaigns.forEach((campaign) => {
        donations.push(campaign.donations);
      });
      var data = {};
      var key = "";
      let labels = [];
      let datasets = [];
      if (donations.length >= 1) {
        donations[0].forEach((donation) => {
          key = donation.method;
          if (key in data) {
            data[key] = data[key] + donation.amount;
          } else {
            data[key] = donation.amount;
          }
        });
        for (var method in data) {
          labels.push(method);
          datasets.push(data[method]);
        }
      } else {
        labels.push("cash");
        labels.push("card");
        datasets.push(0);
      }
      return { labels: labels, datasets: datasets };
    },
    getDonationHistory() {
      let donations = [];
      this.charity.campaigns.forEach((campaign) => {
        donations.push(campaign.donations);
      });
      var data = {};
      var key = "";
      if (donations.length >= 1) {
        donations[0].forEach((donation) => {
          key = this.getMonth(donation.createdAt);
          if (key in data) {
            data[key] = data[key] + donation.amount;
          } else {
            data[key] = donation.amount;
          }
        });
      }
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
      ];
      let amount = [];
      months.forEach((month) => {
        if (month in data) {
          amount.push(data[month]);
        } else {
          amount.push(0);
        }
      });

      return amount;
    },
  },
  async created() {
    try {
      await this["charities/getCharityById"](this.id);
      if (this.$cookie.get("charity") != null) {
        this.count();
        this.getDonationMethods();
        this.isFetching = false;
      } else {
        this.$swal({
          title: "Unauthorized to view home",
          text: "Complete your profile first",
          confirmButtonText: "Redirect to profile",
          confirmButtonColor: "#4466f2",
          icon: "warning",
        }).then((result) => {
          if (result.value) {
            this.$router.push("/profile");
          }
        });
      }
    } catch (error) {
      this.$swal({
        title: "Unauthorized to view home",
        text: "Complete your profile first",
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
};
</script>

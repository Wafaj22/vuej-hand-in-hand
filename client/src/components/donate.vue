<template>
  <!-- Vertically centered Modal Component -->
  <b-modal @hidden="toggleModal()" ref='my-modal' size="lg" hide-footer centered title="Donate" class="theme-modal">
    <b-alert variant="danger" show dismissible class="alert alert-danger alert-dismissible fade show" v-if="error">
      <i class="fa fa-exclamation-triangle mr-2"></i>
      {{error}}
    </b-alert>
    <form-wizard ref="wizard" color="#4466f2" :start-index="0" title="" subtitle="" back-button-text="Back" next-button-text="Next!" finish-button-text="Submit" @on-error="handleErrorMessage" @on-complete="donate">
      <tab-content title="Donation details" :before-change="validateAsync">
        <div class="setup-content" id="step-1">
          <div class="col-xs-12">
            <div class="col-md-12">
              <div class="form-group" :class="{ 'form-group--error': $v.donation.$error }">
                <label class="control-label">Enter donation amount: </label><span class="required"> *</span>
                <input class="form-control" type="text" placeholder="100 $" v-model.trim="$v.donation.$model" />
              </div>
              <template v-if="$v.donation.$error">
                <div class="error" v-if="!$v.donation.required">
                  Field is required
                </div>
                <div class="error" v-if="!$v.donation.numeric">
                  Donation amount must be a valid number.
                </div>
                <div class="error" v-if="!$v.donation.minValue">
                  Donation amount must be more than {{$v.donation.$params.minValue.min}}
                </div>
              </template>
              <div class="form-group m-checkbox-inline mb-0">
                <label class="control-label">Do you want to stay annonymous ?</label>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="annonymous" :value="true">Yes</b-form-radio>
                </div>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="annonymous" :value="false">No</b-form-radio>
                </div>
              </div>
              <div class="form-group" v-if="!annonymous">
                <label class="control-label">Send a message with your donation</label>
                <input class="form-control" type="text" placeholder="" v-model="message" />
              </div>
              <div class="form-group">
                <label class="control-label">Choose payment method:<span class="required"> *</span></label>
                <p></p>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="method" value="paypal"><img class="img-paypal" src="../assets/images/paypal.png" alt /></b-form-radio>
                </div>
                <div class="radio radio-primary d-inline-block">
                  <b-form-radio v-model="method" value="stripe">Credit card</b-form-radio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tab-content>
      <!-- <tab-content title="Payment details" :before-change="validateAsync">
        <div class="setup-content" id="step-2">
          <div class="col-xs-12">
            <div class="col-md-12">

            </div>
          </div>
        </div>
      </tab-content> -->
    </form-wizard>

  </b-modal>

</template>

<script>
import { mapActions, mapState } from "vuex";
import { required, numeric, minValue } from "vuelidate/lib/validators";

export default {
  props: ["campaign", "activeTab"],
  name: "DonateModal",
  data() {
    return {
      //retrieve from database
      profile: true,
      url: false, //get image file from database

      donation: null,
      message: "",
      annonymous: true,
      method: "paypal",

      stripe: null,

      error: null,
    };
  },
  validations: {
    donation: {
      required,
      numeric,
      minValue: minValue(1),
    },
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
  async mounted() {
    this.stripe = window.Stripe(
      "pk_test_51ILrFeHqDbAgU21vYGIzVeF8LpSHp4TdSj2Rg9rWZisPGsprromminVuB2nwE5te8rPhUJYDQFcDfuUt93nt0Kc400gJlHYUao"
    );
    await this.getVolunteerById(this.id);
    console.log(this.volunteer)
    if (this.volunteer) {
      this.showModal();
    } else {
      this.$swal({
        title: "Unauthorized to donate",
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
  methods: {
    ...mapActions([
      "getVolunteerById",
      "updateVolunteer",
      "donation/createDonation",
      "campaigns/updateCampaign",
      "donation/payment",
    ]),
    showModal() {
      this.$refs["my-modal"].show();
    },
    toggleModal() {
      if (this.activeTab == "urgent") {
        this.$emit("toParent", { urgent: true, id: this.campaign._id });
      } else if (this.activeTab == "all") {
        this.$emit("toParent", { urgent: false, id: this.campaign._id });
      } else {
        this.$emit("toParent", false);
      }
    },
    isEmpty: function () {
      return (
        (this.$refs.wizard.activeTabIndex == 0 && this.donation == null) ||
        (this.$refs.wizard.activeTabIndex == 1 && false)
      );
    },
    handleErrorMessage: function (error) {
      this.error = error;
    },
    validateAsync: function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.$v.$anyError) {
            reject("Correct all highlighted errors and try again");
          } else if (this.isEmpty()) {
            reject("Fill up the required fields first");
          } else {
            resolve(true);
          }
        }, 1000);
      });
    },
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    donate() {
      this.stripePay();
    },
    definePayment() {
      let payment = {
        name: this.campaign.title,
        amount: this.donation,
        description: this.campaign.description,
        newDonation: this.defineDetails(),
      };
      console.log(payment);
      return payment;
    },
    async stripePay() {
      await this["donation/payment"](this.definePayment())
        .then((session) => {
          console.log("session: ", session);
          // When the customer clicks on the button, redirect them to Checkout.
          this.stripe
            .redirectToCheckout({ sessionId: session.id })
            .then((result) => {
              console.log("result ", result);
              if (result.error) {
                console.log("ERROR", result.error.message);
                console.log(this.$route.query.success);
              } else {
                console.log("success ful result");
              }
            });
        })
        .catch((error) => console.log("caught error", error));
    },
    defineDetails() {
      let details = {};

      if (!this.annonymous) {
        details = {
          name: this.volunteer.user.name,
          username: this.volunteer.user.username,
          image: this.volunteer.image,
          message: this.message,
        };
      }

      let donation = {
        donor: this.volunteer._id,
        campaign: this.campaign._id,
        amount: this.donation,
        method: this.method,
        annonymous: this.annonymous,
        details: details,
      };

      console.log(donation);
      return donation;
    },
    // addDonation() {
    //   if (this.role == "user") {
    //     let donation = this.defineDetails();

    //     this["donation/createDonation"](donation)
    //       .then((res) => {
    //         if (res.data.success) {
    //           let donation_id = res.data._id;
    //           this.campaign.donations.push(donation_id);
    //           let req2 = {
    //             user: { donations: this.campaign.donations },
    //             id: this.campaign._id,
    //           };
    //           console.log("req2", req2);
    //           this["campaigns/updateCampaign"](req2).then((res) => {
    //             if (res.data.success) {
    //               console.log("updated campaigns");
    //               this.volunteer.donations.push(donation_id);
    //               console.log("donations", this.volunteer.donations);
    //               let req = {
    //                 user: { donations: this.volunteer.donations },
    //                 id: this.id,
    //               };
    //               this.updateVolunteer(req).then((res) => {
    //                 if (res.data.success) {
    //                   console.log("updated donations in volunteer");
    //                 }
    //               });
    //             }
    //           });
    //           this.$swal({
    //             title: "Successfully Added!",
    //             icon: "success",
    //           });
    //           this.$router.push("/");
    //         }
    //       })
    //       .catch(function (err) {
    //         this.$swal({
    //           title: "Unable to add. Try again later.!",
    //           icon: "warning",
    //         });
    //         console.log(err);
    //       });

    //     this.$refs["my-modal"].hide();
    //   } else {
    //     this.$swal({
    //       title: "Unauthorized to add donations!",
    //       text: "Create your profile first",
    //       icon: "warning",
    //     });
    //   }
    // },
  },
};
</script>
<style lang="scss">
.mt-20 {
  margin-top: 20px;
}
.mb-50 {
  margin-bottom: 50px;
}
.img-110 {
  width: 110px;
  height: 110px;
}
.user-image {
  position: relative;
  height: 0;
}
.icon-wrapper {
  position: absolute;
  margin-top: -27px;
  left: 62%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #ffffff;
  cursor: pointer;
  overflow: hidden;
  font-size: 17px;
  box-shadow: 0 0 6px 3px rgba(68, 102, 242, 0.1);
}
.required {
  color: red;
}
</style>
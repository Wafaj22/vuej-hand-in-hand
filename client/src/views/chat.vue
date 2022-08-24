<template>
  <div>
    <!-- Container-fluid starts-->
    <div class="container-fluid">
      <div class="page-title">
        <div class="row">
          <div class="col-6 d-flex">
            <h3>Chat</h3>
          </div>
        </div>
      </div>
      <div class="row" v-if="!isFetching">
        <div class="col call-chat-sidebar col-sm-12">
          <div class="card">
            <div class="card-body chat-body">
              <div class="chat-box">
                <!-- Chat left side Start-->
                <div class="chat-left-aside">
                  <b-tabs nav-class="tabbed-card border-tab border-tab-primary custom-scrollbar">
                    <b-tab title="Charities">
                      <div class="people-list custom-scrollbar" id="people-list">
                        <div class="search">
                          <form class="theme-form">
                            <div class="form-group">
                              <input v-model="search" v-on:keyup="setSerchCollaborators" class="form-control" type="text" placeholder="search" /><i class="fa fa-search"></i>
                            </div>
                          </form>
                        </div>
                        <ul class="list" v-if="search == ''">
                          <li class="clearfix" v-for="(c, index) in collaborators" :key="index" @click="setActiveuser(c.user._id)">
                            <img class="rounded-circle user-image" :src="getImgUrl(c.image)" alt="" />
                            <div class="status-circle away"></div>
                            <div class="about">
                              <div class="name">{{ c.user.name }}</div>
                              <div class="status">{{ c.user.username}}</div>
                            </div>
                          </li>
                        </ul>

                        <ul class="list" v-if="search != ''">
                          <li class="clearfix" v-for="(c, index) in serchCol" :key="index" @click="setActiveuserSerch(c.user._id)">
                            <img class="rounded-circle user-image" :src="getImgUrl(c.image)" alt="" />
                            <div class="status-circle away"></div>
                            <div class="about">
                              <div class="name">{{ c.user.name }}</div>
                              <div class="status">{{ c.user.status }}</div>
                            </div>
                          </li>
                          <div v-if="!serchCol.length">
                            <div class="search-not-found chat-search text-center">
                              <div>
                                <p>
                                  Sorry, We didn't find any results matching
                                  this search
                                </p>
                              </div>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </b-tab>
                    <b-tab class="material-border" title="Volunteers">
                      <div class="people-list custom-scrollbar" id="people-list">
                        <div class="search">
                          <form class="theme-form">
                            <div class="form-group">
                              <input v-model="search" v-on:keyup="setSerchSupporters" class="form-control" type="text" placeholder="search" /><i class="fa fa-search"></i>
                            </div>
                          </form>
                        </div>
                        <ul class="list" v-if="search == ''">
                          <li class="clearfix" v-for="(s, index) in supporters" :key="index" @click="setActiveuser(s.user._id)">
                            <!-- src: s.image -->
                            <img class="rounded-circle user-image" :src="getImgUrl(s.image)" alt="" />
                            <div class="status-circle away"></div>
                            <div class="about">
                              <div class="name">{{ s.user.name }}</div>
                              <div class="status">{{ s.user.username }}</div>
                            </div>
                          </li>
                        </ul>
                        <ul class="list" v-if="search != ''">
                          <li class="clearfix" v-for="(s, index) in serchSup" :key="index" @click="setActiveuserSerch(s.user._id)">
                            <!-- src: s.image -->
                            <img class="rounded-circle user-image" :src="getImgUrl(s.image)" alt="" />
                            <div class="status-circle away"></div>
                            <div class="about">
                              <div class="name">{{ s.user.name }}</div>
                              <div class="status">{{ s.user.username }}</div>
                            </div>
                          </li>
                          <div v-if="!serchSup.length">
                            <div class="search-not-found chat-search text-center">
                              <div>
                                <p>
                                  Sorry, We didn't find any results matching
                                  this search
                                </p>
                              </div>
                            </div>
                          </div>
                        </ul>
                      </div>
                    </b-tab>
                  </b-tabs>
                </div>
                <!-- Chat left side Ends-->
              </div>
            </div>
          </div>
        </div>
        <div class="col call-chat-body">
          <div class="card">
            <div class="card-body p-0">
              <div class="row chat-box">
                <!-- Chat right side start-->
                <div class="col pr-0 chat-right-aside">
                  <!-- chat start-->
                  <div class="chat">
                    <!-- chat-header start-->
                    <div class="chat-header clearfix">
                      <img v-if="currentchat.image" class="rounded-circle" :src="getImgUrl(currentchat.image)" alt="" />
                      <img v-else class="rounded-circle" :src="getImgUrl(image)" alt="" />

                      <div v-if="currentchat.user" class="about">                        
                        <div class="name">
                          {{ currentchat.user.name }}
                        </div>
                        <div class="status digits">
                          {{ currentchat.user.username }}
                        </div>
                      </div>
                      <div v-else class="about">                        
                        <div class="name">
                          {{ name }}
                        </div>
                        <div class="status digits">
                          {{ username }}
                        </div>
                      </div>
                    </div>
                    <!-- chat-header end-->
                    <div class="chat-history chat-msg-box custom-scrollbar">
                      <ul>
                        <li v-for="(chat, index) in currentChat.chat.messages" :key="index" v-bind:class="{
                            clearfix: chat.sender == currentUser,
                          }">
                          <div class="message" v-bind:class="{
                              'other-message pull-right':
                                chat.sender == currentUser,
                              'my-message': chat.sender != currentUser,
                              
                            }">
                            <!-- currentchar.image  v-if="
                                currentchat.image 
                                v-bind:src="getImgUrl('user/1.jpg')" -->
                            <img class="rounded-circle float-left chat-user-img img-30" alt="" v-if="chat.sender != currentUser" v-bind:src="getImgUrl(currentchat.image)" />
                            <img class="rounded-circle float-right chat-user-img img-30" alt="" v-if="chat.sender == currentUser" v-bind:src="getImgUrl(image)" />
                            <div class="message-data" v-bind:class="{'text-right': chat.sender == currentUser,}">
                              <span class="message-data-time">{{chat.time}}</span>
                            </div>
                            {{ chat.text }}
                          </div>
                        </li>
                        <div v-if="!currentChat.chat.messages.length">
                          <div class="image-not-found">
                            <div class="d-block start-conversion">
                              <!-- <img src="../../assets/images/start-conversion.jpg" class="img-fluid"> -->
                            </div>
                          </div>
                        </div>
                      </ul>
                    </div>
                    <!-- end chat-history-->
                    <div class="chat-message clearfix">
                      <div class="row">
                        <div class="col-xl-12 d-flex">
                          <div class="input-group text-box">
                            <input class="form-control input-txt-bx" id="message-to-send" v-model="text" v-on:keyup.enter="sendMessage()" type="text" name="message-to-send" placeholder="Type a message......" />
                            <div class="input-group-append">
                              <button @click="sendMessage()" class="btn btn-primary" type="button">
                                SEND
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- end chat-message-->
                    <!-- chat end-->
                    <!-- Chat right side ends-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Container-fluid Ends-->
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import io from "socket.io-client";
import router from "@/router";

export default {
  name: "Chat",
  data() {
    return {
      isFetching: true,
      name: "",
      username: "",
      image: "",
      text: "",
      search: "",
      activeChat: null,
      currentUser: null,
      currentchat: [],
      chatmenutoogle: false,
      socket: io("http://localhost:5000", {
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd",
        },
      }),
    };
  },
  components: {},
  computed: {
    ...mapState({
      serchSup: (state) => state.chat.serchSup,
      serchCol: (state) => state.chat.serchCol,
      supporters: (state) => state.chat.supporters,
      collaborators: (state) => state.chat.collaborators,
      currentChat() {
        return (this.currentchat = this.$store.getters["chat/currentChat"]);
      },
      volunteer: (state) => state.volunteers.volunteerProfile,
      role: (state) => state.auth.role,
      id: (state) => state.auth.id,
      charity: (state) => state.charities.charityProfile,
      chats: (state) => state.chat.chats,
      activeuser: (state) => state.chat.activeuser,
    }),
  },
  watch: {
    currentchat() {
      if (this.activeuser != undefined) {
        console.log("emitted");
        console.log(this.currentchat.user);
        this.socket.emit("PRIVATE_MESSAGE", {
          receiver: this.activeuser,
          sender: this.currentUser,
        });
      }
    },
  },
  async created() {
    if (router.currentRoute.params.id) {
      await this["charities/getCharityById"](router.currentRoute.params.id)
        .then((res) => {
          if (res.data.success) {
            if (res.data.user) {
              const { _id, image, user, ...otherDetails } = res.data.user;
              console.log(otherDetails);
              this.$store.commit("chat/addNew", { _id, image, user });
            }
          }
        })
        .catch((error) => {
          console.log("None found", error);
        });
      await this.getVolunteerById(router.currentRoute.params.id)
        .then((res) => {
          if (res.data.success) {
            if (res.data.user) {
              const { _id, image, user, ...otherDetails } = res.data.user;
              console.log({ otherDetails });
              this.$store.commit("chat/addNew", { _id, image, user });
            }
          }
        })
        .catch((error) => {
          console.log("None found", error);
        });
    } 
    if (this.role == "charity") {
      await this["charities/getCharityById"](this.id).then(async (res) => {
        if (res.data.success) {
          let users = [];
          
          this.currentUser = res.data.user.user._id;
          this.username = res.data.user.user.username;
          this.name = res.data.user.user.name
          this.$store.commit("chat/setSupporters", res.data.user.supporter);
          this.$store.commit("chat/setCollaborators", res.data.user.connection);

          users.push(this.currentUser);
          users.push(router.currentRoute.params.id);

          this.$store.commit("chat/setActiveuser", {
            receiver: router.currentRoute.params.id,
            sender: this.currentUser,
          });
          await this.$store.dispatch("chat/getChat", this.currentUser);
          this.image = this.$cookie.get("charity-image");

          this.currentchat = this.$store.getters["chat/currentChat"];
          this.isFetching = false;
          console.log("current chat", this.currentChat);
        }
      });
    } else if (this.role == "user") {
      await this.getVolunteerById(this.id).then(async (res) => {
        if (res.data.success) {
          let users = [];

          this.currentUser = res.data.user.user._id;
          this.$store.commit("chat/setSupporters", []);
          this.$store.commit("chat/setCollaborators", res.data.user.charities);

          users.push(this.currentUser);
          users.push(router.currentRoute.params.id);

          this.$store.commit("chat/setActiveuser", {
            receiver: router.currentRoute.params.id,
            sender: this.currentUser,
          });
          await this.$store.dispatch("chat/getChat", this.currentUser);
          this.image = this.$cookie.get("volunteer-image");

          this.currentchat = this.$store.getters["chat/currentChat"];
          this.isFetching = false;
          console.log("current chat", this.currentChat);
        }
      });
    }
  },
  mounted() {
    this.initSocket();
  },
  methods: {
    ...mapActions([
      "charities/getCharityById",
      "charities/updateCharity",
      "getVolunteerById",
      "getProfile",
      "chat/getChat",
    ]),
    getImgUrl(path) {
      return "http://localhost:5000/" + path;
    },
    setActiveuser: function (id) {
      this.$store.dispatch("chat/setActiveuser", {
        receiver: id,
        sender: this.currentUser,
      });
    },
    setActiveuserSerch: function (id) {
      this.setActiveuser(id);
      this.search = "";
    },
    setSerchCollaborators: function () {
      if (this.search != "")
        this.$store.dispatch("chat/setSerchCollaborators", this.search);
    },
    setSerchSupporters: function () {
      if (this.search != "")
        this.$store.dispatch("chat/setSerchSupporters", this.search);
    },
    //Sockets
    initSocket: function () {
      console.log("send username from client", this.id);
      this.socket.emit("USER_CONNECTED", this.id, ({ isUser }) => {
        if (isUser) {
          console.log("User already connected");
        } else {
          console.log("Connected");
        }
      });
      this.socket.on("PRIVATE_MESSAGE", this.addMessage);
    },
    addMessage: function (chat) {
      this.activeChat = chat;
      const messageEvent = `MESSAGE_RECEIVED-${chat.id}`;
      this.socket.on(messageEvent, this.outputMessage(chat.id));
    },
    outputMessage: function (chatId) {
      return (message) => {
        console.log(chatId, "message", message);
        this.addMessageToChat(message);
      };
    },
    addMessageToChat: function (message) {
      this.$store.dispatch("chat/addChat", message);
      this.addMessageToDatabase(message);
      var container = this.$el.querySelector(".chat-history");
      setTimeout(function () {
        container.scrollBy({ top: 200, behavior: "smooth" });
      }, 310);
    },
    sendMessage: function () {
      if (this.text != "") {
        this.socket.emit("MESSAGE_SENT", {
          chatId: this.activeChat.id,
          message: this.text,
        });
        this.text = "";
      }
    },
    addMessageToDatabase: function () {
      console.log(this.chats);
      let req = {
        id: this.currentUser,
        user: { chat: this.chats },
      };

      console.log("req", req);

      // if (this.role == "charity") {
      //   this["charities/updateCharity"](req).then((res) => {
      //     if (res.data.success) {
      //       console.log("updated chat");
      //     }
      //   });
      // } else if (this.role == 'user'){
      //   this["volunteers/updateVolunteer"](req).then((res) => {
      //     if (res.data.success) {
      //       console.log("updated chat in volunteer");
      //     }
      //   });
      // }
    },
  },
};
</script>
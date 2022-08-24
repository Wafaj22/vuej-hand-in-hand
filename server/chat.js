const io = require('./app.js').io
const {createUser, createChat, createMessage} = require('./utils/messages');

let connectedUsers = { }

let sendMessageToChatFromUser;

module.exports = (socket) => {
  console.log("Socket Id:" + socket.id);

	//User Connects with username
	socket.on('USER_CONNECTED', (username, callback) => {	
		if(isUser(connectedUsers, username)){
			callback({isUser:true})
		}else{
			console.log('sent username',username)
			const user = createUser({name:username, socketId:socket.id});
			
			callback({isUser:false})
			
			user.socketId = socket.id
			
			connectedUsers = addUser(connectedUsers, user)
			
			socket.user = user
			
			//Define sendMessage
			console.log('user id', user.name);
			sendMessageToChatFromUser = sendMessageToChat(user.name)

			//Update who is connected
			io.emit('USER_CONNECTED', connectedUsers)
			console.log(connectedUsers);
		}

	})

  
  //Listening for chat messages
  socket.on('PRIVATE_MESSAGE', ({receiver, sender})=>{
	console.log('reciver',receiver,sender);
	const newChat = createChat({ name:`${receiver}&${sender}`, users:[receiver, sender] })
	
	if(receiver in connectedUsers){
		const receiverSocket = connectedUsers[receiver].socketId			
		socket.to(receiverSocket).emit('PRIVATE_MESSAGE', newChat)
	}
	socket.emit('PRIVATE_MESSAGE', newChat)	
  }); 
	
	socket.on('MESSAGE_SENT', ({chatId, message})=>{
		sendMessageToChatFromUser(chatId, message)
	})
  
	//User logsout
	socket.on('LOGOUT', ()=>{
		connectedUsers = removeUser(connectedUsers, socket.user.name)
		
		//Update after disconnection
		io.emit('USER_DISCONNECTED', connectedUsers)
		console.log("Disconnect", connectedUsers);

	})

   
  //Runs when client disconnects
	socket.on('disconnect', ()=>{
		if("user" in socket){
			connectedUsers = removeUser(connectedUsers, socket.user.name)

			//Update after disconnection
			io.emit('USER_DISCONNECTED', connectedUsers)
			console.log("Disconnect", connectedUsers);
		}
	})

};

function sendMessageToChat(sender){	
	return (chatId, message)=>{
		io.emit(`MESSAGE_RECEIVED-${chatId}`, createMessage({message, sender}))
	}
}

function isUser(userList, username){
  	return username in userList
}

function addUser(userList, user){
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

function removeUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

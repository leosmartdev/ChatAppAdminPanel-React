const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Leo: mix v_chat
const helmet = require('helmet'); // helmet morgan body-parser mongoose
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
dotenv.config();
connectDB();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// v_chat mix ---------------------------------------

// adding Helmet to enhance your API's security
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

//to send data from post man and any front end
app.use(bodyParser.urlencoded({ extended: false }));

// public place for img
app.use('/uploads', express.static('uploads'));

// parse an HTML body into a string
app.use(bodyParser.json());
const serviceAccount = require('./vchatappmongo-firebase-adminsdk-r81s8-00cd33ab16.json');
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://yourtech-a45201.firebaseio.com"
});

const auth = require('./routes/auth');
const user = require('./routes/user');
const analytics = require('./routes/analytics');
const prohibitedwords = require('./routes/prohibatedwords');
const blocklimitedwords = require('./routes/blocklimitedwords');
const chat = require('./routes/chat');
const pages = require('./routes/pages');

// v_chat mix
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter.js');
const likesRouter = require('./routes/likesRouter');
const conversionsRouter = require('./routes/conversionsRouter');
const messageRouter = require('./routes/messagesRouter');
const commentRouter = require('./routes/commentsRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const publicRoomRouter = require('./routes/publicRoomsRouter');
const publicRoomMessagesRouter = require('./routes/publicRoomMessagesRouter');

const settingsRouter = require('./routes/settingsRouter');

app.use('/api/v1/analytics', analytics);
app.use('/api/v1/auth', auth);
// app.use('/api/v1/user', user);
app.use('/api/v1/prohibited-words', prohibitedwords);
app.use('/api/v1/block-limited-words', blocklimitedwords);
app.use('/api/v1/pages', pages);
app.use('/api/v1/chat', chat);

// v_chat mix
app.use('/api/v1/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/v1/conversions', conversionsRouter);
app.use('/api/like', likesRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/comment', commentRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/v1/rooms', publicRoomRouter);
app.use('/api/v1/roomMessages', publicRoomMessagesRouter);

app.use('/api/v1/settings', settingsRouter);

app.use(errorHandler);

// v_chat mix: socket - index.js
const socketIO = require("socket.io");
const server = require("http").createServer(app);
const io = socketIO(server);

io.onlineUsers = {};

require("./sokets/init.socket")(io);
require("./sokets/convs.socket")(io);
require("./sokets/message.socket")(io);
require("./sokets/publicRoomsSocket")(io);
// --------------------------------

app.get('/',function(req,res){
  res.send("server work");
});

const port = process.env.PORT || 4000;
// const server = app.listen(port, () => console.log(`Listening *: ${port}`));
server.listen(port, () => {
  console.log(`Listening *: ${port}`);
});

// Handle unhandle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

/**
 * Create HTTP server.
 */
const express = require('express');
const app = express();
const http = require('http').createServer(app);

const path = require('path');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const io = require('socket.io')(http);

// Route modules
const register = require('./server/routes/register.route');
const auth = require('./server/routes/auth.route');
const member = require('./server/routes/member.route');
const list = require('./server/routes/list.route');
const user = require('./server/routes/user.route');
const ticketType = require('./server/routes/ticket-type.route');
const category = require('./server/routes/category.route');

// MongoDB connection
const mongoose = require('mongoose');
const dev_db_url = 'mongodb://127.0.0.1:27017/orf-tickets';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(compression())
// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'html')));

app.use('/register', register);
app.use('/auth', auth);
app.use('/member', member);
app.use('/list', list);
app.use('/user', user);
app.use('/ticket-type', ticketType);
app.use('/category', category);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './html/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);


io.on('connection', (socket) => {});
/**
 * Listen on provided port, on all network interfaces.
 */
http.listen(port, () => {
  console.log(`API running on localhost:${port}`);
});

io.on('connect', (socket) => {
  socket.on('userChanged', (user) => {
    io.emit('userChanged', user);
  });
  socket.on('memberChanged', (member) => {
    io.emit('memberChanged', member);
  });
  socket.on('memberStatusChanged', (members) => {
    io.emit('memberStatusChanged', members);
  });
  socket.on('memberDeleted', (members) => {
    io.emit('memberDeleted', members);
  });
  socket.on('newListCreated', (list) => {
    io.emit('newListCreated', list);
  });
  socket.on('listUpdated', (list) => {
    io.emit('listUpdated', list);
  });
  socket.on('listDeleted', (list) => {
    io.emit('listDeleted', list);
  });
  socket.on('ticketTypeChanged', (ticket) => {
    io.emit('ticketTypeChanged', ticket);
  });
});
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const routes = require('./routes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleware);

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.set('view engine', 'hbs');

app.use(routes);

// mongoose.connect('mongodb://127.0.0.1:27017/second-hand-electronics'); // I'm on linux and does not work with
// // localhost to me

// // TODO Change database name
port = 3000;
mongoose.connect(`mongodb://127.0.0.1:27017/second-hand-electronics`).then(() => {
    console.log(`DB Connected`);
    // First wait for database to connect and then the server to connect after database is connected
    app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));
}).catch((err) => {
    console.log(`Cannot connect to DB`);
    console.log(err);
});
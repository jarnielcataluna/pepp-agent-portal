//Install express server
const express = require('express');
const path = require('path');
var cors = require('cors')
var xlsx = require('xlsx')



const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/pepp-portal'));

app.use(cors())
app.use(xlsx())

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname, '/dist/pepp-portal/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
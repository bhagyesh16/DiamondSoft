const express = require('express');
const cors = require('cors');
require("dotenv").config()
const userRouter = require('./routes/router');
const session = require('express-session');
const { sequelize } = require('./dbconfig');
const colourRouter = require('./Master/colour')
const cutRouter = require('./Master/cut')
const shapeRouter =  require('./Master/shape')
const purityRouter = require('./Master/purity')
const flrnRouter = require('./Master/flrn')
const sievesRouter = require('./Master/sieves')
const RoughDesc= require('./Master/roughdesc')
const {router:prizelistroute} = require('./routes/pricelist')
const pricelistRouter = require('./routes/getpricelist')
const uploadRoute = require('./routes/uploadRoute')
const ownupload = require('./routes/ownupload')
const Rough_header = require('./routes/Rough_header')
const roughpricelist = require('./Master/roughpricelist')
const RoughCalc = require('./routes/RoughCalc')
const Natts = require('./Master/natts')
const Milky = require('./Master/milky')
const LB = require('./Master/LB_tinich')
const cutdiscount = require('./routes/CutDiscount')
const flrndiscount = require('./routes/FlrnDiscount')
const Stddiscount= require('./routes/StdDiscount')
const nattsdiscount = require('./routes/NattsDiscount')
const milkydiscount = require('./routes/MilkyDiscount')
const Lbdiscount = require('./routes/LBDiscount')
const app = express();
const port = 5000;
var corsoption = {
    origin: [process.env.FRONTEND_URL], // Whitelist specific origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    credentials: true, // Allow sending cookies or authorization headers
    optionsSuccessStatus: 204,
  }
app.use(cors(corsoption));
app.use(express.json());
console.log(`url:`+process.env.FRONTEND_URL);
// Add express-session middleware
app.use(session({
    secret: '$bhagyesh@1602',
    resave: true,
    saveUninitialized: true
}));

sequelize.sync()

    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

app.use('/api', userRouter,prizelistroute,pricelistRouter,ownupload,uploadRoute,Rough_header,cutdiscount,flrndiscount,Stddiscount,nattsdiscount,milkydiscount,Lbdiscount);
app.use('/master',cutRouter,flrnRouter,RoughDesc,purityRouter,colourRouter,shapeRouter,sievesRouter,roughpricelist,RoughCalc,Natts,Milky,LB);


app.listen(port, () => {
    console.log(`Server is running on http://192.168.1.59:${port}/api/users`);
});

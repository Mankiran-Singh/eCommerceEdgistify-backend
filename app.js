const express=require('express');
const cors=require('cors');
const authRouter=require('./Routes/authRouter');
const productsRouter=require('./Routes/productsRouter');
const CustomError = require('./utils/customError');
const MongoStore = require('connect-mongo');
const globalErrorHandler=require('./Controllers/errorController')
const session=require('express-session');
const cookieParser = require('cookie-parser');

let app=express();

app.use(express.json());
const corsOptions = {
    origin: "http://localhost:4200",
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

app.use(cookieParser());


app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ 
        mongoUrl: process.env.CONN_STR,
        collectionName: 'sessions'
      }),
      cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 } // 1 hour
    })
  );
  

app.use('/user',authRouter);

app.use('/products',productsRouter);

app.all('*',(req,res,next)=>{
        const err=new CustomError(`can't find ${req.originalUrl} on the server!`,404)
        next(err); //express will forget about other middlewares and put this middleware in middleware stack(global error handling) 
    });
    
app.use(globalErrorHandler)  

 module.exports=app;
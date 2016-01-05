/**
  Loading all dependcies.
**/

var express         =	  require("express");
var redis           =	  require("redis");
var session         =	  require('express-session');
var redisStore      =	  require('connect-redis')(session);
var bodyParser      =	  require('body-parser');
var cookieParser    =	  require('cookie-parser');
var path            =	  require("path");
var async           =	  require("async");
var passport        =     require('passport');
var LocalStrategy   =     require('passport-local').Strategy;
var bcrypt          =     require('bcrypt-nodejs');
var Sequelize       =     require('sequelize');
var client          =     redis.createClient();
var app             =	  express();
var router          =	  express.Router();

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);

// redis-session settings
app.use(session({
		secret: 'ssshhhhh',
		store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
		saveUninitialized: false,
		resave: false
}));

// initilizing passport and session
app.use(passport.initialize());
app.use(passport.session());

// express session and bodyparser settings
app.use(cookieParser("secretSign#143_!223"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Sequelize database setup
var db = new Sequelize('nodeJs', 'mohit', 'root', {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
                max: 5,
                min: 0,
                idle: 10000
        },
});

var User = db.define("user", {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    createdAt: new Date(),
    updatedAt: new Date()
  },{
  tableName: 'user', // this will define the table's name
  timestamps: false  // this will deactivate the timestamp columns
});

// main root route
router.get('/',function(req,res){
	res.render('index.html');
});

// login routes
router.post('/login',passport.authenticate('local-login'),function(req, res){
        req.session.key = req.UserInfo;
        if (req.session.key) {
            return res.status(req.UserInfo.status).send(req.UserInfo);
        }else{
             console.log("The redis-key value doesn't set");   
        }
});

// register route
router.post('/register', passport.authenticate('local-signup'),function(req, res){
        return res.status(req.UserInfo.status).send(req.UserInfo);
});

// logout route
router.get('/logout',function(req,res){
        if(req.session.key) {
                req.session.destroy(function(){
                        return res.status(200).json({"status":200 ,"message":"Logout successfully"});
                });
        } else {
                return res.status(200).json({"status":400 ,"message":"error occured while logout"});
        }
});

// getUser listing route
router.get('/getUserListing', function(req, res){
        User.findAll({
                        order : 'id'
                }).then(function(data){
                if (data) {
                        var users = [] ;
                        if (data.length) {
                            for(var i=0 ; i<data.length; i++){
                                users.push({
                                        "id" : data[i].id ,
                                        "firstname" : data[i].firstname ,
                                        "lastname" : data[i].lastname ,
                                        "email" : data[i].email 
                                });
                            }
                        }
                        return res.status(200).json(users)
                }else{
                        return res.status(500).json({"status":500,"message":"Error occured while getting user listing"})        
                }
        });
});

// updateUser route
router.post('/updateUser',function(req, res){
        User
        .findOne({ where: { id: req.body.id } })
        .then(function(users) {
                if (users) {
                        User.update({
                                firstname : req.body.firstname,
                                lastname : req.body.lastname,
                                email : req.body.email
                        },{
                                where: {
                                        id : req.body.id
                                }
                        }).then(function(status){
                                if(status){
                                       var UserInfo = {
                                                "status" : 200,
                                                "message" : "User updated successfully"
                                        }; 
                                        return res.status(200).json(UserInfo); 
                                }else{
                                        var UserInfo = {
                                                "status" : 500,
                                                "message" : "Error Occured while updating user"
                                        }; 
                                        return res.status(500).json(UserInfo);
                                }        
                        });
                } else {
                        var UserInfo = {
                                "status" : 400,
                                "message" : "User not found"
                        }; 
                        return res.status(400).json(UserInfo);
                }
        });
});

//deleteUser route
router.post('/deleteUser',function(req, res){
        User.destroy({
                where: {
                  id: req.body.id
                }
        }).then(function(status){
                if (status) {
                        var UserInfo = {
                                "status" : 200,
                                "message" : "User deleted successfully"
                        }; 
                        return res.status(200).json(UserInfo)
                }else{
                        var UserInfo = {
                                "status" : 500,
                                "message" : "Error occured while deleteing user"
                        }; 
                        return res.status(500).json(UserInfo)
                }
        });
});

//server settings
app.use('/',router);
app.listen(9006,function(){
	console.log("Server is running at port:9006");
});

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    if (email)
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
        User
        .findOne({ where: { email: req.body.email } })
        .then(function(users) {
                if (users) {
                       if (users.password == req.body.password) {
                                req.UserInfo = {
                                        "status" : 200,
                                        "message" : "Users Authenticated successfully",
                                        "data" : req.body.email
                                }; 
                                return done(null,req.UserInfo);  
                       }else{
                                req.UserInfo = {
                                        "status" : 400,
                                        "message" : "Password Not macthed"
                                }; 
                                return done(null,req.UserInfo);
                       }
                } else {
                        req.UserInfo = {
                                "status" : 400,
                                "message" : "User Not Found"
                        }; 
                        return done(null,req.UserInfo);
                }
        });
        
    });

}));

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    if (email)
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    // asynchronous
        process.nextTick(function() {
        // if the user is not already logged in:
        if ( req.body.email ) {
                User
                .findOne({ where: { email: req.body.email } })
                .then(function(users) {
                       
                        if (users) {
                                req.UserInfo = {
                                        "status" : 400,
                                        "message" : "User already exits"
                                }; 
                                return done(null,req.UserInfo);
                        } else {
                                var info = {
                                        "firstname" : "" ,
                                        "lastname" : "" ,
                                        "email" : req.body.email ,
                                        "password" : req.body.password ,
                                }
                                User.create(info).then(function(user){
                                        req.UserInfo = {"status":200,"message":"user registred successfully","data":req.body.email} ;
                                        return done(null,req.UserInfo);
                                });
                        }
                });
        } else {
            // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
            return done(null, req.body.params);
        }
    });

}));
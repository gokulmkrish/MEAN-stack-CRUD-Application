const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Validator = require('schema-validator');
const bcrypt = require('bcrypt-nodejs');
const PORT = process.env.PORT || 3000;
const app = express();
const fs = require('fs');
var path = require('path')

mongoose.connect("mongodb://localhost:27017/Accounts", { useNewUrlParser: true, useCreateIndex: true });

app.set("Secret", "gokulkrish");
app.use(express.json());

// use morgan to log requests to the console
var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

var schema = mongoose.Schema;
var empSchema = schema({
    name: { type: "string", required: true, description: "required and must be a string", },
    empid: { type: Number, required: true, description: "required and must be a string", unique: true },
    email: { type: "string", required: true, description: "required and must be a string", unique: true },
    phoneno: { type: Number, required: true, description: "required and must be a string" },
    role: { type: "string", required: true, description: "required and must be a string", },
    status: { type: "string", required: true, description: "required and must be a string", },
    usertype: { type: "string" }
}, { versionKey: false }
);

var adminSchema = schema({
    username: { type: "string", required: true, description: "required string" },
    password: { type: "string", required: true, description: "required string" },
    name: { type: "string", required: false, description: "required string" },
    email: { type: "string", required: false, description: "required string" },
}, {
        collection: "admin"
    }
);

//Validations   
empSchema.plugin(uniqueValidator);
var validator = new Validator(empSchema);
validator.debug = true;


// hash the password for admin
adminSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
adminSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// User Collection name
var User = mongoose.model("Users", empSchema);

//var Admin = mongoose.model("Admin", adminSchema);
var Admin = mongoose.model("admin", adminSchema);

//to check the server status
app.get('/', (req, res) => {
    res.send("<h2>EmpForm App Server running on" + PORT + "</h2>");
});

// Api Login
app.post('/api/admin/authenticate', (req, res) => {
    var qusername = req.body.username;
    var qpassword = req.body.password;
    if (qusername && qpassword) {
        Admin.find({ username: qusername }, function (err, data) {
            if (err)
                res.json(err);
            else {
                let result = data[0];
                if (result) {
                    if (bcrypt.compareSync(qpassword, result.password)) {
                        const payload = { check: true, data: result };
                        //if eveything is okey let's create our token
                        var token = jwt.sign(payload, app.get('Secret'), {
                            expiresIn: 1440 // expires in 24 hours
                        });
                        res.status(200).json({ message: 'authentication done ', token: token });
                    } else
                        res.json({ message: 'Incorrect password' });
                } else
                    res.json({ message: 'Records not found' });
            }
        });
    } else
        res.status(400).json({ message: 'Please provide username / email and password' });
});

// Middlware to check the authorizationd
app.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('Secret'), function (err, decoded) {
            if (err)
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            else {
                req.decoded = decoded;
                console.log("-------", decoded);
                next();
            }
        });
    } else {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }
});

//To create new employee
app.post("/api/employee/create", (req, res) => {
    var newemp = new User({
        name: req.body.name,
        empid: req.body.empid,
        role: req.body.role,
        email: req.body.email,
        phoneno: req.body.phoneno,
        status: req.body.status,
        usertype: 'employee',
    });
    newemp.save((err, data) => {
        if (err)
            res.json(err);
        else {
            res.json(data);
        }
    });
});

//get all employees
app.get("/api/employee/retrive", (req, res) => {
    var limitdata = req.query.limit ? JSON.parse(req.query.limit) : "";
    var skipdata = req.query.skip ? JSON.parse(req.query.skip) : "";
    if (req.query.id) {
        User.findOne({ _id: req.query.id }, (err, data) => {
            if (err)
                res.json(err);
            else {
                if (data)
                    res.json(data);
                else
                    res.json({ message: "Records not found" });
            }
        })
    } else if (req.query.email) {
        User.findOne({ email: req.query.email }, (err, data) => {
            if (err)
                res.send(err);
            else {
                if (data)
                    res.json(data)
                else
                    res.json({ message: 'Records not found' });
            }
        }).skip(skipdata).limit(limitdata);
    } else if (req.query.username) {
        User.findOne({ username: req.query.username }, (err, data) => {
            if (err)
                res.send(err);
            else {
                var result = data;
                if (result)
                    res.json(result)
                else
                    res.json({ message: 'Records not found', });
            }
        }).skip(skipdata).limit(limitdata);
    } else {
        User.find({}, (err, data) => {
            if (err)
                res.send(err);
            else {
                if (data !== "")
                    res.json(data)
                else
                    res.json({ message: 'Records not found', });
            }
        }).skip(skipdata).limit(limitdata);
    }
});

//Employee update api
app.put("/api/employee/update", (req, res) => {
    let body = req.body;
    console.log(body);
    if (body._id) {
        User.findOne({ _id: body._id }, (err, data) => {
            if (err)
                res.status(401).json(err);
            else {
                var result = data;
                if (result) {
                    result.name = body.name;
                    result.empid = body.empid;
                    result.role = body.role;
                    result.email = body.email;
                    result.status = body.status;
                    result.phoneno = body.phoneno;
                    result.save(function (err, docs) {
                        if (err)
                            res.status(401).json(err);
                        else
                            res.status(200).json(docs);
                    });
                } else 
                    res.status(400).json({ message: 'Record with the given email not found', });
            }
        });
    } else 
        res.json({ message: 'ID is missing', });
});

// To delete the employee from the collection
app.delete("/api/employee/delete/:empid", function (req, res) {
    var id = req.params.empid;
    if (id) {
        User.findByIdAndRemove(id, function (err, data) {
            if (err)
                res.json(err);
            else {
                if (data) {
                    data.message = 'Successfully deleted';
                    res.status(200).json(data);
                } else
                    res.json({ message: 'Record not found', });
            }
        });
    } else
        res.json({ message: 'Please provide username / email', });
});

app.listen(PORT, () => {
    console.log(`Server is Running on : ${PORT}`);
});

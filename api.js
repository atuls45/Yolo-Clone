let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/busDb", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

let ticketModel = require('./database/ticketDetails');

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*------------create api---------------------*/
app.post('/fillDb', function (req, res) {
    for (let i = 1; i <= 40; i++) {
        let ins = new ticketModel({ status: true, ticketNo: i });
        ins.save(function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.json({ msg: 'Data Saved!' });
})

/*------------userdetails api---------------------*/
app.get('/userDetails/:number', function (req, res) {
    let no = req.params.number;
    if (no > 40 || no < 1) {
        res.json({ Data: 'Invalid Input!' });
        return;
    }
    let lt = ticketModel.findOne({ ticketNo: no });
    lt.exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json({ Data: data.userDetails });
        }
    });
});

/*--------------view all closed tickets-----------*/
app.get('/closed', function (req, res) {
    let query = ticketModel.find({ "status": false }).select("ticketNo");

    query.exec(function (err, data) {
        if (err) console.log(err);
        else res.json({ Data: data })
    })
})

/*--------------view all open tickets-----------*/
app.get("/open", function (req, res) {
    let query = ticketModel.find({ "status": true }).select("ticketNo");
    query.exec(function (err, data) {
        if (err) console.log(err);
        else res.json({ Data: data });
    })
});

/*--------------update tickets-----------*/
app.put('/updateTicket', function (req, res) {
    let no = req.body.ticketNo;
    if (no > 40 || no < 1) {
        res.json({ data: "Invalid Input!" });
        return;
    }

    ticketModel.updateOne({ "ticketNo": no }, req.body, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({ Data: "Data Updated" });
        }
    });
});

/*--------------TicketStatus api-------------------*/
app.get('/ticketStatus/:number', function (req, res) {
    let no = req.params.number;
    if (no > 40 || no < 1) {
        res.json({ data: "Invalid Input!" });
        return;
    }

    let query = ticketModel.findOne({ "ticketNo": no }).select("status");
    query.exec(function (err, data) {
        if (err) console.log(err);
        else if (data.status) {
            res.json({ Data: "Open" });
        } else {
            res.json({ Data: "Close" });
        }
    });
});

/*--------------reset tickets-----------*/
app.put("/reset", function (req, res) {
    ticketModel.updateMany({ "status": false }, { "$set": { "status": true, "userDetails": [] } }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({ Data: "Data reset" });
        }
    });
})


app.listen(8899, function () {
    console.log("Work on 8899")
})

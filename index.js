const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const Datastore = require('nedb')
const db = new Datastore({ filename: 'ds.db', autoload: true })
app.use(express.static('front-end/dist'))
app.use(bodyParser.json())
app.use(cors())

const port = 3003

app.get('/get/:id', (req, res) => {
    db.find( {_id:req.params.id}, (err,data)=> {
        res.send({err,data})
    } )
})

app.get('/listall', (req, res) => {
    db.find( {}, (err,data)=> {
        res.send({err,data})
    } )
})

app.post('/ment/:id', (req, res) => {
    if (req.params.id==='undefined') {
        db.insert(req.body, (err, newDoc) => {   
            res.send({err,newDoc})
        })
    } else {
        db.update({_id: req.params.id}, req.body, (err,uDoc) => {
            res.send({err,uDoc})
        })
    }
    
})

app.listen(port)
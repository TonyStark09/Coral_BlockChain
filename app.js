
const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use(morgan('short'))

app.post('/user_create', (req, res) => {
 

  console.log("user name: " + req.body.create_User_name)
  const userName = req.body.create_User_name
  const password = req.body.create_password
  const email = req.body.create_email
  const phonenumber = req.body.create_phonenumber
  
  

  const queryString = "INSERT INTO userData (userName, password,email,phonenumber,dateTime) VALUES (?, ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE  userName='?',phonenumber='?'"
   

  getConnection().query(queryString, [userName, password, email, phonenumber], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertId);
    res.end()
  })
})

function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'dummyUser',
    password: 'dummyUser01',
    database: 'db_intern'
  })
}

app.get('/user/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  const connection = getConnection()

  const userId = req.params.id
  const queryString = "SELECT * FROM userData WHERE id = ?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
      // throw err
    }

  

    const users = rows.map((row) => {
      return {userName: row.userName}
    })

    res.json(users)
  })
})

app.get("/users", (req, res) => {
  const connection = getConnection()
  const queryString = "SELECT * FROM userData"
  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})
app.post("/users_search", (req, res) => {
  const connection = getConnection()
  const search_email = req.body.search_email
  console.log(search_email)
const queryString = "SELECT * FROM userData WHERE email = search_email"

  connection.query(queryString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to search for users: " + err)
      
      res.sendStatus(500)
      return
    }
    res.json(rows)
  })
})


app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("hello")
})

// localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})

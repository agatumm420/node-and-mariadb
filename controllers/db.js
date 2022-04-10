var admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
var serviceAccount = require("./serviceAccountKey.json");
const mariadb = require('mariadb');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     // The database URL depends on the location of the database
//     databaseURL: "https://projekt-up-default-rtdb.firebaseio.com"
// });
// // const dbConnect=()=>{
//     const db = getDatabase();
//     var ref = db.ref("users");
//     ref.once("value", function(snapshot) {
//       console.log(snapshot.val());
//     });
//    // const usersRef = ref.child('users');
//    let count=0;
//    ref.on('child_added', (snap) => {
//       count++;
//       console.log('added:', snap.key);
  
  
//     });

exports.db=(req, res)=>{
    const pool = mariadb.createPool({ socketPath:'/run/mysqld/mysqld.sock', user:'aga', password:'password', database:'app'});
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // The database URL depends on the location of the database
        databaseURL: "https://projekt-up-default-rtdb.firebaseio.com"
    });
    const db = getDatabase();
    var ref = db.ref("users");
    ref.once("value", function(snapshot) {
      console.log(snapshot.val());
    });
   // const usersRef = ref.child('users');
   let count=0;
   ref.on('child_added', (snap) => {
      count++;
      console.log('added:', snap.key);
      pool.getConnection()
      .then(conn => {
        console.log("connected ! connection id is " + conn.threadId);
        conn.query("INSERT INTO users value (?, ?, ?, ?, ?)",[snap.val().user_id, snap.val().username, snap.val().password, snap.val().name, snap.val().email])
        .then(res=> console.log(res));
        //conn.query(`INSERT INTO users(email, name, password, user_id, username) VALUES (${snap.val().email}, ${snap.val().name}, ${snap.val().password},${snap.val().user_id}, ${snap.val().username})`)
        conn.release(); //release to pool
      })
      .catch(err=> console.log(err));
  
    });
    
    var feed_ref=db.ref("feed");
    feed_ref.on('child_added', (snap) => {
      count++;
      console.log('added:', snap.key);
      pool.getConnection()
      .then(conn=>{
        console.log("connected ! connection id is " + conn.threadId);
        conn.query("INSERT INTO feed value(?,?,?)",[snap.val().feed_id, snap.val().feed_txt, snap.val().user_id])
        .then(res=>console.log(res));
        conn.release();
      })
      .catch(err=>console.log(err));
    });
    res.sendStatus(count);
}

  
const express= require('express');
 router=express.Router();
db=require('../controllers/db');
router.get('/',db.db);
module.exports=router;
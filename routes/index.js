var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  req.db.collection('flowers').distinct('color', function(err, colorDocs){
    if (err) {
      return next(err)
    }

    if (req.query.color_filter) {

      req.db.collection('flowers').find({"color":req.query.color_filter}).toArray(function (err, docs) {
        if (err) {
          return next(err);
        }
        return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs, 'color_filter': req.query.color_filter});
      });

    } else {
      req.db.collection('flowers').find().toArray(function (err, docs) {
        if (err) {
          return next(err);
        }
        return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs});

      });
    }
  });
});


router.get('/details/:flower', function(req, res, next){
  req.db.collection('flowers').findOne({'name' : req.params.flower}, function(err, doc) {
    if (err) {
      return next(err);  // 500 error
    }
    if (!doc) {
      return next();  // Creates a 404 error
    }
    return res.render('flower_details', { 'flower' : doc });
  });
});


router.post('/addFlower', function(req, res, next){
  //if flower doesn't already exist in database 
  var filter = { 'name' : req.body.name };
  var array =[];
  //credit for following http://stackoverflow.com/questions/32531204/cannot-access-mongodb-object-in-array-returns-undefined
  req.db.collection('flowers').find(filter).toArray(function(err,data){
    array=data;
	console.log("array length is "+array.length);
  
  
  if (array.length == 0)
  {
  req.db.collection('flowers').insertOne(req.body, function(err){
    if (err) {
      return next(err);
    }
  
	return res.redirect('/');
  }
  else
  {
	  res.write(alert("flower already exists"));
  }
  
  });  
  
  });
});


router.put('/updateColor', function(req, res, next) {

  var filter = { 'name' : req.body.name };
  var update = { $set : { 'color' : req.body.color }};

  req.db.collection('flowers').findOneAndUpdate(filter, update, function(err) {
    if (err) {
      return next(err);
    }
    return res.send({'color' : req.body.color})
  })
});

router.post("/deleteflower/:flower", function(req,res,next){
	
	req.db.collection('flowers').deleteOne({'name' : req.params.flower}, function(err, doc) {
	//redirect back to homepage
	return res.redirect("/");
	});
	
});
module.exports = router;

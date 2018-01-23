'use strict';


var mongoose = require('mongoose'),
Device = mongoose.model('Device');

exports.list_all_devices = function(req, res) {
  Device.find({}, function(err, device) {
    if (err)
      res.send(err);
    console.log('Length: '+device.length);  
    res.json(device);
  });
};

exports.create_a_device = function(req, res) {
    var new_device = new Device(req.body);
    new_device.save(function(err, device) {
      if (err)
        res.send(err);
      res.json(device);
    });
  };
  
  exports.read_a_device = function(req, res) {
    Device.findById(req.params.deviceId, function(err, device) {
      console.log('req.params.deviceId -> '+ req.params.deviceId);
      if (err)
        res.send(err);
      res.json(device);
    });
  };
  
  
  exports.update_a_device = function(req, res) {
    console.log('update_a_device -> '+ req.params.deviceId);
    Device.findOneAndUpdate({_id: req.params.deviceId}, req.body, {new: true}, function(err, device) {
      if (err)
        res.send(err);
      res.json(device);
    });
  };
  
  
  exports.delete_a_device = function(req, res) {
  
  
    Device.remove({
      _id: req.params.deviceId
    }, function(err, device) {
      if (err){
        res.status(400);
        res.send(err);
      }else{
        res.status(204);
        res.json({ message: 'Device successfully deleted' });
      }        
    });
  };
  
  
  
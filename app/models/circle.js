var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var CircleSchema = new Schema({
  title:     {type : String, trim : true},
  amount:    {type : Number},
  period:    {type : Number},  
  user:      {type : Schema.ObjectId, ref : 'User'},
  users:     [{type : Schema.ObjectId, ref : 'User'}],
  createdAt: {type : Date, default : Date.now}
})

CircleSchema.statics = {

load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name')	
      .exec(cb)
  }

}

mongoose.model('Circle', CircleSchema)

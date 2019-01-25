const mongoose=require('mongoose');

const OrderSchema=new mongoose.Schema({
    resname:{
      type:String,
      trim:true,
      minlength:1
    },

    restmode:{
      type:[String],
      minlength:1
    },

    mode:{
      type:String,
      required:true,
      trim:true,
      minlength:1,
    },

    time:{
      type:String,
      trim:true
    },

    status:{
      type:String,
      required:true,
      trim:true,
      minlength:1
    },

    fromnumber:{
      type:Number,
      required:true,
      trim:true,
      minlength:10
    },

    tonumber:{
      type:Number,
      required:true,
      trim:true,
      minlength:10
    },

    glocation:{
      type:String,
      required:true,
      trim:true,
      minlength:1
    },

    id:{
      type:String,
      required:true,
      trim:true,
      minlength:1
    },

    summmary:{
      type:String,
      required:true,
      trim:true,
      minlength:1
    },

    total:{
      type:Number,
      required:true,
      trim:true,
      minlength:1
    },

    order:[{
      price:{
        type:[Number],
        minlength:1
      },
      category:{
        type:[String],
        minlength:1
      },
      image:{
        type:String,
        minlength:1
      },
      availability:{
        uptime:{
          type:Number,
          minlength:1
        },
        downtime:{
          type:Number,
          minlength:1
        }
      },
      name:{
        type:String,
        minlength:1
      },
      resname:{
        type:String,
        minlength:1
      },
      number:{
        type:String,
        minlength:1
      },
      levelone:{
        type:String,
        minlength:1
      },
      leveltwo:{
        type:String,
        minlength:1
      },
      index:{
        type:Number,
        minlength:1
      },
      quantitiy:{
        type:Number,
        minlength:1
      },
      description:{
        type:String,
        minlength:1
      }
    }]
});

const Order=mongoose.model('Order',OrderSchema);

module.exports={Order};

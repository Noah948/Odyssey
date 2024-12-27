const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const url="https://media.cntraveler.com/photos/6539da3124725ada6bbacb8c/master/w_1200,c_limit/Amazon-GettyImages-1454581656.jpg";
const list=new Schema(
    {
        title:{
            type:String,
            require:true,
        },
        description:String,
        image:{
            url:{
                type:String,
                default:url,
            },
            fileName:String,
        },
        price:{
            type:Number,
            minimum:0
        },
        location:String,
        country:String,
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            },
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    },
)
const listing=mongoose.model("listing",list);
module.exports=listing;
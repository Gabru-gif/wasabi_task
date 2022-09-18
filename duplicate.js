const express = require('express');
const mongoose =require('mongoose');
const app=express();

mongoose.connect("mongodb://localhost:27017/wasabi",{
  useNewUrlParser:true}  ,(err)=>{
    if(err)
    {
      console.log(err);
    }
    else
    {
        console.log("successFully connected")
    }
}
)

const NewSchema= new mongoose.Schema({
key:String,
Sha256:String
})
const DuplicateSchema=new mongoose.Schema({
Sha256:String,
UiqueIds:String,
Count:String
})

const DuplicateModel=new mongoose.model("Duplicate",DuplicateSchema);

const newModel= new mongoose.model("wasabiws", NewSchema);

function Duplicate()
{

  const Dup= newModel.aggregate([
   {
        $group: {
            _id:{Sha256:"$Sha256"},
            uniqueIds:{$addToSet: "$key"},  
            count: { $sum: 1 }
        }
    },
    {
        $match: {
            count: { $gt: 1 }
        }
    }],function(err , result){
        // console.log(result)
        store(result);    })
        //console.log(Dup)
        // store(Dup);
    }
    
Duplicate();
function store(Dup) {
// console.log(Dup[0]._id.Sha256)
    return new Promise(async(resolve, reject) => {
      try {
        Dup.forEach(async (Dups)=>{
        
        //         // const result= await newModel.insertMany([{key:`${key}`,Sha256:`${checksum}`}])
        const result= await DuplicateModel.insertMany([{Sha256: `${Dups._id.Sha256}`, UiqueIds:`${Dups.uniqueIds}` , Count:`${Dups.count}`}])
        // console.log(result)
        return resolve(result)   
    })
       }catch(err){
        return reject(err)
      }
      
    })
  }
  

app.listen(7000,()=>{
  console.log("on port 7000 !!!")
})

// db.wasabiws.aggregate([
    
    // {
    //     $group: {
    //         _id:{SHA256:"$Sha256"},
    //         uniqueIds:{$addToSet: "$key"},
    //         count: { $sum: 1 }
    //     }
    // },

    // {
    //     $match: {
    //         count: { $gt: 1 }
    //     }
    // }
// ])
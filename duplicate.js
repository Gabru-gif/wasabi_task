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
UiqueIds: [{type: Schema.Types.Mixed}],
Count:String
})

const DuplicateModel=new mongoose.model("Duplicate",DuplicateSchema);

const newModel= new mongoose.model("wasabiws", NewSchema);

function Duplicate()

/**
 * sha
 *  uniqueIds: {
 *  id: [ {date: 22-09-2010, data: 93785973757 }, {date: 8-7-2002, data: 3984983578}]
 * }
 */
{

  /**
   * {
   *  140 : [ {date: 22-09-2010, data: 93785973757 } ]
   *  141: [{date: 22-09-2010, data: 93785973757 }]
   * }
   */
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

// output show in database
{
  "_id": {
    "$oid": "632202f22574e678792708aa"
  },
  "Sha256": "8decc8571946d4cd70a024949e033a2a2a54377fe9f1c1b944c20f9ee11a9e51",
  "UiqueIds": "140/2022-04-16/d12480cd-c361-413d-9c0e-3178aa7f5a1a/sample.pdf,140/2022-04-13/be1f00e6-851b-411e-87bf-3a5bcb778545/sample.pdf,48/2022-04-15/f69f2422-a089-4de7-a70a-3b1b5ef943ed/sample.pdf,48/2022/06/07/da2d78c8-0587-4b76-be0e-83cb47ac9e1a/file,48/2022-04-10/687802d2-ee90-4779-91ba-f9133f1c671e/file,48/2022-04-10/6e37de50-677c-4890-8a94-b5eb59826c2f/abc.pdf,48/2022-04-12/9f12ddb8-1063-408b-9435-85416aa24ba4/sample.pdf,48/2021/10/02/2d563280-baad-42e6-a5b9-7b9c5d28b5ef/sample.pdf,48/2022-04-10/0eefd200-0fc7-4477-a07f-0e69b3f1c6b0/abc.pdf",
  "Count": "9",
  "__v": 0
}

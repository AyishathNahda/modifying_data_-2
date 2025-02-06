const { config } = require('dotenv');
const express = require('express');
const { resolve } = require('path');
require('dotenv').config();
const mongoose=require('mongoose');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

const MONGO_URI=process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(()=> console.log('Connected to db'))
.catch(err=>console.log("error connecting to db"));

//defining schema

const menuItemSchema=new mongoose.Schema({
  name: {type:String,required:true},
  description:{type:String},
  price:{type:Number,required:true}
});

const MenuItem=mongoose.model('MenuItem',menuItemSchema);

app.put('/menu/:id',(req,res)=>{
  const {name,description,price}=req.body;
  const {id}=req.params;

  if(!name||!description||!price){
    return res.status(400).json({error:'Fields are required'});
  }

MenuItem.findByIdAndUpdate(id,{name,description,price},{new:true})
.then(updatedMenuItem =>{
  if(!updatedMenuItem){
    return res.status(400).json({error:'menu itme not found'});
  }
  res.json(updatedMenuItem);
})
.catch(error=>{
  res.status(500).json({error:'failed to update menu item',error});

});


  


});

app.delete('/menu/:id',(req,res)=>{
  const {name,description,price}=req.body;
  const{id}=req.params;
  if(!name||!description||!price){
    return res.status(400).json({error:'fields are required'});
  }

  MenuItem.findByIdAndDelete(id,{name,description,price},{new:true})
  .then(deletedItem =>{
    if(!deletedItem){
      return res.status(400).json({error:'menu item not found'});
    }
    res.json(deletedItem);
  })
  .catch(error =>{
    res.status(500).json({error:'failed to delete menu item',error});
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

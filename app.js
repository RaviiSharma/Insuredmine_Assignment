const express=require('express')
const app=express();

var userRoute=require('./Routes/userRoute')



var mongoose=require('mongoose');
mongoose.connect('mongodb+srv://RaviKumarSharma:i6tpVmiNCvIQSjH6@cluster0.pnzdn4a.mongodb.net/Insuredmine_DB', {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))




app.use('/',userRoute);

app.listen(3000,function(){
    console.log('Express is running');

});
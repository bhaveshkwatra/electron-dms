var express = require('express');
const app = express();
const path1 = require('path');
var script = require('./script')
var mime = require('mime-types');
const fs = require('fs');
app.use('/',express.static(path1.join(__dirname,'public')))
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/drive', (req, res) => {

    var path= req.query.path;
    if(path)
    {
        script.getPathFiles(path).then((pathList) => {
            if(pathList==='')
            {
                res.download(path)
            }else {
                res.send({folders:pathList[0],files:pathList[1],path:path,isDrive:false})
            }
        }).catch((err)=> res.send('Error'+err))
    }
    else {
        script.getDrives().then((data) => {
            res.send({data:data,isDrive:true,})
        })
    }

})

app.get('/download', (req, res) => {
    var path= req.query.path;
    res.download(path);
})



app.listen(8004, () => {
    console.log("server started @ 8004");
})

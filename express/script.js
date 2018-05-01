const drivelist = require('diskinfo');
const fs = require('fs');
const util = require('util')
var dateFormat = require('dateformat');
var myDrives = new Array();
const path1 = require('path')

function getDrives() {
    return new Promise((resolve,reject)=>{
        
        drivelist.getDrives((err,drives)=>{
            if(err) throw err;
           
            // drives.forEach((drive)=>{
            //     myDrives.push({path : "" + drive.mounted + '\\'});
            // })
            // resolve(myDrives);
                    myDrives = new Array();
                   myDrives.push({path:'C:\\'});
                   myDrives.push({path:'E:\\'});
                    resolve(myDrives) 
        })

     })
    
}
function getPathFiles(path)
{
    let pathDriveListDir=[];
    let pathDriveListFile=[];


    return new Promise((resolve,reject)=>{

        if (!fs.statSync(path).isFile()) {
            fs.readdirSync(path).forEach(file => {
                var mtime='';
                var size=0;
                var ext = '';
                try {
                    var val = fs.statSync(path + file);
                    if (val !== undefined)
                        mtime = new Date(util.inspect(val.mtime));
                    if(val.size!==0)
                    {
                        size=val.size
                    }
                }
                catch (e) {
                }
                ext = path1.extname(file);
                try {
                    if(fs.statSync(path + file).isFile())
                    {
                        pathDriveListFile.push({name:file,isFile:true,size:Math.ceil((size/1000).toFixed(1)),ext:ext,mtime:dateFormat(mtime, "dd.mm.yyyy h:MM")})
                    }else {
                        pathDriveListDir.push({name:file,ext:'File folder',size:0,isFile:false,mtime:dateFormat(mtime, "dd.mm.yyyy h:MM")})
                    }
                }
                catch (e) {
                    pathDriveListDir.push({name:file,ext:'File folder',size:0,isFile:false,mtime:dateFormat(mtime, "dd.mm.yyyy h:MM")})
                }

            })
            var pathlist = [pathDriveListDir,pathDriveListFile]
            resolve(pathlist)
        }else{
            resolve('','')
        }
    })


}


module.exports={
    getPathFiles,getDrives
}
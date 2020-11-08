const router = require('express').Router()
const fs = require('fs')
const yifysubtitles = require('yifysubtitles');

router.post('/sub', (req, res) => {
    console.log("subtitle :"+req.body.id)
    const id = req.body.id
    return new Promise((resolve, reject) =>{
     const directory = './src/MoviesHash/subti/'+id;
     if (!fs.existsSync(directory))
           fs.mkdirSync(directory, {recursive: true}, err => {console.log("Folder Created")})
        return yifysubtitles(id, {
         path: directory,
         langs: ['en', 'fr', 'ar']
        }).then((ret) => {
             for(let i = 0; i < ret.length; i++){
                const t =  fs.readFileSync(directory+'/'+ret[i].fileName, 'utf8')
                let buff = Buffer.from(t)
                let base64data = buff.toString('base64');
                ret[i].fileName = base64data
             }
            res.send(ret)
        }).catch(err => {
             console.log(err)
        });
    })
})

module.exports = router
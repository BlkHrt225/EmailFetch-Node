const express = require('express')
const app = express();
const gmail = require('./index')
const Imap = require('imap')
var libmime = require('libmime')
var Url = require('url-parse')
var listresult=[];
const port = process.env.PORT||3000;
const { inspect } = require('util');
const { url } = require('inspector');
sinspect = require('util').inspect;
var result=null
var final='oka'
var email='';
var pass='';
var flag=false;
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.get('/',(req,res)=>{
    
    var query = req.query
    res.send('Hello')
    res.send(query)
})
app.post('/getMail',(req,res)=>{
    if(req.body){
        email=req.body.email;
        pass=req.body.password;
      
       start().then(response=>{final=response
        res.send(final)
    
    }).catch(err=>res.send(err))
    

        
    }
    
})


app.post('/getMailList',(req,res)=>{
    if(req.body){
        email=req.body.email;
        pass=req.body.password;
      
       startlist().then(response=>{final=response
        res.send(final)
    
    }).catch(err=>res.send(err))
    

        
    }
    
})

//const connection1=mongo.connect("mongodb+srv://testAdmin:12345@cluster0.rmeli.mongodb.net/sample_airbnb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true}).then(res=>console.log("Db Connected")).catch(err=>console.log("Error conneting to Db"+err))


function  start(){

    var imap = new Imap({


        user:email,
    password: pass,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions:{rejectUnauthorized:false}
    
    })


  
  imap.connect()
  imap.once('ready',()=>{imap.openBox('INBOX',true,(err,box)=>{
     if(err)console.log(err);else{ console.log(box)
            var f= imap.seq.fetch(box.messages.total+':*',{ bodies: ['HEADER.FIELDS (FROM)','2'],struct:true })
            f.on('message',(msg,seqno)=>{
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function(stream, info) {
                  if (info.which === 'TEXT')
                    console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                  var buffer = '', count = 0;
                  stream.on('data', function(chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                    //console.log(buffer)
                    result=buffer
                    console.log(result)
                    if (info.which === 'TEXT')
                      console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                  });
                  stream.once('end', function() {
                    if (info.which !== 'TEXT')
                      console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    else
                      console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                  });
                });
                msg.once('attributes', function(attrs) {
                  console.log(prefix + 'Attributes: %s', inspect(attrs,false,8));
                
                });
                msg.once('end', function() {
                  console.log(prefix + 'Finished');
                });
              });
              f.once('error', function(err) {
                console.log('Fetch error: ' + err);
              });
              f.once('end', function() {
                console.log('Done fetching all messages!');
                imap.end();
              });
            
  
            }})});if(result){

               var newresult=libmime.decodeFlowed(result)
              var finalresult = newresult.replace("=09","")
            return new Promise((resolve,reject)=>{
                if(newresult){
               resolve(finalresult) }
               else{
               reject("error") }
            })
        }
        }
//startConn = ()=>{
  //  console.log(email)
    
  //imap.connect((res)=>{
    //    console.log(res)
//    })
    
//}
/*function findTextPart(struct) {
    for (var i = 0, len = struct.length, r; i < len; ++i) {
      if (Array.isArray(struct[i])) {
        if (r = findTextPart(struct[i]))
          return r;
      } else if (struct[i].type === 'text'
                 && (struct[i].subtype === 'plain'
                     || struct[i].subtype === 'html'))
        return [struct[i].partID, struct[i].type + '/' + struct[i].subtype];
    }
  }
  
  function getMsgByUID(uid,imap, cb, partID) {
    var f = imap.fetch(uid, partID
                            ? { bodies: ['HEADER.FIELDS (TO FROM SUBJECT)', partID[0]] }
                            : { struct: true }),
        hadErr = false;
  
    if (partID)
      var msg = { header: undefined, body: '', attrs: undefined };
  
    f.on('error', function(err) {
      hadErr = true;
      cb(err);
    });
  
    if (!partID) {
      f.on('message', function(m) {
        m.on('attributes', function(attrs) {
          partID = findTextPart(attrs.struct);
        });
      });
      f.on('end', function() {
        if (hadErr)
          return;
        if (partID)
          getMsgByUID(uid, cb, partID);
        else
          cb(new Error('No text part found for message UID ' + uid));
      });
    } else {
      f.on('message', function(m) {
        m.on('body', function(stream, info) {
          var b = '';
          stream.on('data', function(d) {
            b += d;
          });
          stream.on('end', function() {
            if (/^header/i.test(info.which))
              msg.header = Imap.parseHeader(b);
            else
              msg.body = b;
          });
        });
        m.on('attributes', function(attrs) {
          msg.attrs = attrs;
          msg.contentType = partID[1];
        });
      });
      f.on('end', function() {
        if (hadErr)
          return;
        cb(undefined, msg);
      });
    }
  }*/
  function findTextPart(struct) {
    for (var i = 0, len = struct.length, r; i < len; ++i) {
      if (Array.isArray(struct[i])) {
        if (r = findTextPart(struct[i]))
          return r;
      } else if (struct[i].type === 'text'
                 && (struct[i].subtype === 'html'
                    ))
        return [struct[i].partID, struct[i].type + '/' + struct[i].subtype];
    }
  }


  function startlist(){
    var imap = new Imap({
        user: email,
        password: pass,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions:{rejectUnauthorized:false}
      });
       
     
        
     
       
      imap.once('ready', function() {
       
        imap.openBox('INBOX', true,(err,box)=>{
          var f = imap.seq.fetch("1:10", {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true
          });
          f.on('message', function(msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
              var buffer = '';
              stream.on('data', function(chunk) {
                buffer += chunk.toString('utf8');
                listresult.push(buffer);
              });
              stream.once('end', function() {
                console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              });
            });
            msg.once('attributes', function(attrs) {
              console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
              console.log(prefix + 'Finished');
            });
          });
          f.once('error', function(err) {
            console.log('Fetch error: ' + err);
          });
          f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
          });
        });
      });
       
      imap.once('error', function(err) {
        console.log(err);
      });
       
      imap.once('end', function() {
        console.log('Connection ended');
      });
       
      imap.connect();

      if(listresult){
        return new Promise((resolve,reject)=>{
            if(listresult){
           resolve(listresult) }
           else{
           reject("error") }
        })
      }
  }


app.listen(port,()=>console.log(`Running on ${port}`))


var express = require('express');
var path = require('path');
//var popup= require('popups');
//const storage = require('node-sessionstorage');
var app = express();
const cookieParser = require('cookie-parser');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get ("/" , (req, res)=>{
   var cookie = req.cookies.logincookie;
   
   res.redirect("login");
   
  });

  app.get ("/login" , (req, res)=>{
      if (req.cookies.logincookie!=undefined){
         res.redirect("home")
      }
  
      res.render("login",{hidden:"hidden"});
   }
);


app.get ("/books" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }

    res.render("books");
   });

app.get ("/boxing" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }

    res.render("boxing",{hidden:"hidden"});
  });
app.get ("/cart" , async (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
   var {id} = req.cookies.logincookie
   var cart = await getcart(id);

   res.render("cart",{"items":cart})


res.render("cart");
});

app.get ("/galaxy" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }

   res.render("galaxy" ,{hidden:"hidden"});
  });

app.get ("/home" ,async (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
  
  
   res.render("home");
});

app.get ("/tennis" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
   res.render("tennis",{hidden:"hidden"});
  });
  app.get ("/sun" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
   res.render("sun",{hidden:"hidden"});
  });



app.get ("/iphone" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
res.render("iphone",{hidden:"hidden"});
});

app.get ("/leaves" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
res.render("leaves",{hidden:"hidden"});
});

app.get ("/phones" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }

res.render("phones");
});

app.get ("/register" , (req, res)=>{

   res.redirect("registration");
   });
app.get ("/registration" , (req, res)=>{
   if (req.cookies.logincookie!=undefined){
      res.redirect("home")
   }
res.render("registration",{hidden:"hidden"});
});

// app.get ("/searchresults" , (req, res)=>{

// res.render("searchresults");
// });

app.get ("/sports" , (req, res)=>{
   if (req.cookies.logincookie==undefined){
      res.redirect("login")
   }
res.render("sports");
});



app.post ("/login",async(req,res)=>{
var user=req.body.username
var pass=req.body.password
var output =await getallusers();
flag=true
for (var i=0;i<output.length;i++){
   if(user===output[i].username && pass===output[i].password){
      const user = {
         'id':output[i].id,
         'username':output[i].username,
         'password':output[i].password,

      }

      res.cookie("logincookie",user)
      res.redirect('home')
      
      flag=false
   }
 
}
if(flag){
   res.render("login",{hidden:""})
}
   

})
app.post ("/register",async(req,res)=>{
var user=req.body.username
var pass=req.body.password
var output =  await getallusers();
var flag=false
if (user=="" || pass ==""){
   flag=true
}

for(i=0; i<output.length;i++)
{
if(output[i].username== user)
{
   flag=true
}
}

if ( flag){
   //failed to register 
   res.render('registration',{hidden:""})
}
else {
   
   var num = output.length +1;
   const person = {
      'id':num,
      'username':user,
      'password':pass,

   }
   res.cookie("logincookie",person);
   insertuser(user , pass).catch(console.error);

   await createCart(num);
   res.redirect('home');

}

})
async function insertuser( user ,  pass){
   var {MongoClient}= require ('mongodb')
   var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
   var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
   await client.connect();
  
   // var output = await client.db('firstdb').collection('firstcollection').find().toArray();

   var output = await (await client.db('firstdb').collection('firstcollection').find().toArray()).length;
   var id = output +1;
   var user={id: id ,username:`${user}`,password:`${pass}`};
   await client.db('firstdb').collection('firstcollection').insertOne(user);
 client.close();  
}

async function getallusers(){
var {MongoClient}= require ('mongodb')
var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
await client.connect();

   var output = await client.db('firstdb').collection('firstcollection').find().toArray();

   client.close();  
   return output;
}

async function getcart(id ){
   var {MongoClient}= require ('mongodb')
var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
await client.connect();
   var cart = []
   var output = await client.db('firstdb').collection('cart').find().toArray();
   for (i=0; i<output.length ; i++){
      if (output[i].id== id){
         cart= output[i].cart;
      }
   }
   client.close();  
   return cart;
}

async function createCart( id ){
   var {MongoClient}= require ('mongodb')
   var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
   var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
   await client.connect();
  
   // var output = await client.db('firstdb').collection('firstcollection').find().toArray();

   var user={id: id, cart: []};
   await client.db('firstdb').collection('cart').insertOne(user);
}
async function setcart(id , cart){
   var {MongoClient}= require ('mongodb')
   var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
   var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
   await client.connect();

   await client.db('firstdb').collection('cart').updateOne({id:id}, {$set:{
      cart:cart
   }});

}

app.post ('/sun',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='The Sun and Her Flowers'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("sun",{hidden:""})
   }
   else{
   newcart.push('The Sun and Her Flowers');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})
app.post ('/boxing',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='Boxing Bag'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("boxing",{hidden:""})
   }
   else{
   newcart.push('Boxing Bag');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})
app.post ('/iphone',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='iPhone 13 Pro'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("iphone",{hidden:""})
   }
   else{
   newcart.push('iPhone 13 Pro');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})
app.post ('/galaxy',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='Galaxy S21 Ultra'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("galaxy",{hidden:""})
   }
   else{
   newcart.push('Galaxy S21 Ultra');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})
app.post ('/leaves',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='Leaves of Grass'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("leaves",{hidden:""})
   }
   else{
   newcart.push('Leaves of Grass');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})

app.post ('/tennis',async(req,res)=>{
   var {id} = req.cookies.logincookie
   var cart =await getcart(id);
   var newcart=[]
   flag=false;
   for (i=0;i<cart.length ;i++){
      if(cart[i]=='Tennis Racket'){
         flag=true;
      }
      newcart.push(cart[i])
   }
   if (flag){
      res.render("tennis",{hidden:""})
   }
   else{
   newcart.push('Tennis Racket');
   await setcart(id,newcart)
   res.redirect('cart');
   }
})

app.post ("/search",async(req,res)=>{
   var itemTyped = req.body.Search
   var outputItems =await getallitems()
   var itemsArr = []
   for(var i=0; i<outputItems.length; i++)
   {
      if((outputItems[i].itemName.toLowerCase()).includes(itemTyped.toLowerCase()))
      {
         itemsArr.push(outputItems[i].itemName)
      }
   
   }

   var hidden='';
   if(itemsArr.length!=0){
         hidden="hidden";
   } 
   res.render('searchresults', {searchresults:itemsArr,hidden:hidden});
   })
app.post("/logout",(req,res)=>{
   
   res.clearCookie("logincookie");
   
   
   res.redirect("login");
})

   async function getallitems(){
      var {MongoClient}= require ('mongodb')
      var uri="mongodb+srv://admin:de7k@cluster0.z58tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
      var client =new MongoClient(uri,{useNewurlParser:true,useUnifiedTopology:true});
      await client.connect();
      var outputItems = await client.db('firstdb').collection('items').find().toArray();

         client.close();
         return outputItems;}

         app.get ("/iPhone%2013%20Pro",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("iphone");
         });
         app.get ("/The%20Sun%20and%20Her%20Flowers",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("sun");
         });
         app.get ("/Leaves%20of%20Grass",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("leaves");
         });
         app.get ("/Boxing%20Bag",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("boxing");
         });
         app.get ("/Galaxy%20S21%20Ultra",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("galaxy");
         });
         app.get ("/Tennis%20Racket",(req, res)=>{
            if (req.cookies.logincookie==undefined){
               res.redirect("login")
            }
            res.redirect("tennis");
         });

      app.get('/*', (req,res)=>{
         if (req.cookies.logincookie==undefined){
            res.redirect("login");
         }
         else{
         
            res.redirect("home");
         }
      })
if(process.env.PORT){
   app.listen(process.env.PORT,function(){
      console.log('Server started')
   })
}
else{
   app.listen(3000,()=>{
      console.log("Server Started on port 3000");
   });
}
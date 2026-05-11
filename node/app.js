// console.log('Hello World! This is a Node.js application.');
const http=require('http');
const fileSystem=require('fs');
const os =require('os');
const { setTimeout } = require('timers/promises');
// const freeMemory=(os.freemem());

// const totalMemory=(os.totalmem());
// console.log(totalMemory.toFixed(2));

// console.log(freeMemory);


// fileSystem.readFile('./index.html', 'utf8', (err,data1)=>{
//     if(err){
//         console.log('Error reading file:',err);
//         return;
//     }
//     console.log(data1);
// });


// fileSystem.mkdir('./newFolder/workineh/workaya', {recursive: true}, (err,data)=>{
//     if(err){
//         console.log('Error creating directory:',err);
//         return;
//     }   
//     console.log('Directory created successfully!'+data);
// });


// fileSystem.writeFile('./newFolder/workineh/workaya/index.html', 'Hello, this is a new file created by Node.js!', (err)=>{
//     if(err){
//         console.log('Error writing file:',err);
//         return;
//     }
//     console.log('File created successfully!');
// });


// console.log(__dirname);
// console.log(__filename);




http.createServer(
  (req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end(data1);
    console.log('server created!');
  }
).listen(3000, () => {
  console.log('Server is running on port 3000');
});
// server.listen(port,()=>{
//     console.log('Server is running on port '+port);
// });

//   setTimeout(()=>{
//   console.log("Hell from setTimeout."), 3000
// })

//EFI structure
(
  function (){
    console.log("Hello, from function1");
  
  let x=2;
  const inc= console.log("Increement="+ x++);
  function adder(){
    console.log(x++==inc);
  }
  adder();
}());


(
  function(){
    console.log("Hello from function2");
    function result(){
   let x=3;
  console.log(x++);
    }
 
    result();

  }());
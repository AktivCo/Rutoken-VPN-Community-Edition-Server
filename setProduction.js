
var fs = require('fs'),
    path = require('path');

var filePath = path.join(__dirname, './Vpn/settings.py');
var result = fs.readFileSync(filePath , 'utf8');

var ar = result.split('\n');

for(var i = 0, len = ar.length; i < len; i++){
    if(ar[i].indexOf("DEBUG = True") !== -1)
        ar[i] = "DEBUG = False";
    
    if(ar[i].indexOf("IS_DEMO_MODE = True") !== -1)
        ar[i] = "IS_DEMO_MODE = False"; 
                    
}
var str = ar.join("\n");

fs.writeFile(filePath, str, (err) => console.log(err));

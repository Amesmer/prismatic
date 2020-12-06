var http = require('https');

var fs = require('fs');
var qs = require('querystring');





var data = {
  'draw': 1,
  'columns[0][data]': 0,
  'columns[0][name]': null,
  'columns[0][searchable]': true,
  'columns[0][orderable]': true,
  'columns[0][search][value]': null,
  'columns[0][search][regex]': false,
  'columns[1][data]': 1,
  'columns[1][name]': null,
  'columns[1][searchable]': true,
  'columns[1][orderable]': true,
  'columns[1][search][value]': null,
  'columns[1][search][regex]': false,
  'columns[2][data]': 2,
  'columns[2][name]': null,
  'columns[2][searchable]': false,
  'columns[2][orderable]': true,
  'columns[2][search][value]': null,
  'columns[2][search][regex]': false,
  'columns[3][data]': 3,
  'columns[3][name]': null,
  'columns[3][searchable]': true,
  'columns[3][orderable]': true,
  'columns[3][search][value]': null,
  'columns[3][search][regex]': false,
  'columns[4][data]': 4,
  'columns[4][name]': null,
  'columns[4][searchable]': true,
  'columns[4][orderable]': true,
  'columns[4][search][value]': null,
  'columns[4][search][regex]': false,
  'columns[5][data]': 5,
  'columns[5][name]': null,
  'columns[5][searchable]': true,
  'columns[5][orderable]': true,
  'columns[5][search][value]': null,
  'columns[5][search][regex]': false,
  'columns[6][data]': 6,
  'columns[6][name]': null,
  'columns[6][searchable]': true,
  'columns[6][orderable]': true,
  'columns[6][search][value]': null,
  'columns[6][search][regex]': false,
  'columns[7][data]': 7,
  'columns[7][name]': null,
  'columns[7][searchable]': true,
  'columns[7][orderable]': true,
  'columns[7][search][value]': null,
  'columns[7][search][regex]': false,
  'columns[8][data]': 8,
  'columns[8][name]': null,
  'columns[8][searchable]': true,
  'columns[8][orderable]': true,
  'columns[8][search][value]': null,
  'columns[8][search][regex]': false,
  'columns[9][data]': 9,
  'columns[9][name]': null,
  'columns[9][searchable]': true,
  'columns[9][orderable]': true,
  'columns[9][search][value]': null,
  'columns[9][search][regex]': false,
  'columns[10][data]': 10,
  'columns[10][name]': null,
  'columns[10][searchable]': true,
  'columns[10][orderable]': true,
  'columns[10][search][value]': null,
  'columns[10][search][regex]': false,
  'columns[11][data]': 11,
  'columns[11][name]': null,
  'columns[11][searchable]': true,
  'columns[11][orderable]': false,
  'columns[11][search][value]': null,
  'columns[11][search][regex]': false,
  'order[0][column]': 1,
  'order[0][dir]': 'desc',
  'start': 0,
  'length': 10,
  'search[value]': null,
  'search[regex]': false,
  '_': 1596070429573
}
var start=0
var result = []
var fff = 1
var body=''
function getmsg(data) {
  var content = qs.stringify(data);
  var options = {
    hostname: 'gw2.wishingstarmoye.com',
    path: "/admin/gw2_traitsdb_dt_ajax?" + "draw=1&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=2&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=false&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=3&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=4&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=5&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=6&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=7&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=8&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=9&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=false&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=1&order%5B0%5D%5Bdir%5D=asc&start="+start+"&length=10&search%5Bvalue%5D=&search%5Bregex%5D=false&_=1596220308209",
    method: 'GET',
    headers: {
      'Accept-Encoding': 'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
      'Cookie': 'Hm_lvt_f1ea546e0562d559199deef091557294=1595504505,1596037985,1596070258,1596190451; stateclear={"gw2_traitsdbs":true,"gw2_skills":true}; Hm_lpvt_f1ea546e0562d559199deef091557294=1596220309; XSRF-TOKEN=eyJpdiI6ImVadlY0M29DSkVxeThHV1NZeUMrVlE9PSIsInZhbHVlIjoiYldhNlhRTlg4NDZHQ2VoRHI0NDR6N2Z0SnU2YWtPb1BudVU1SmN2OXo2bUZBQzUxXC8zVWYwWVMrQ2c2N1wvXC9EWG96QVV5ZkRVczh4c29nYmZENUxQYlE9PSIsIm1hYyI6IjNjYTE0NDk0ZDdiNGJjNThhZjE0YjYzYmE5ZTcwYTI5MzIyNTdiNDBiMDgzMTJlZGUyYTc1MDRhYmUzMmY3MmYifQ%3D%3D; laravel_session=eyJpdiI6IndCXC9iNFV2TnRjVW40azVzd3NSTEt3PT0iLCJ2YWx1ZSI6IitIa1hPTkZla293TnpsTDY2WjFcL2phQktNeE1nUngyT2ZaSVdITkZ0UFNSK09ab2ZPMVloeEZzQnJUTmllV0VGRXRKVnBGRTVTOCtKdHBkaG5VRVBBZz09IiwibWFjIjoiY2MxODllMzY4ZGFkMzExYTljMjgzNWRjN2FiMTI2ZTkyNThmYWI2MWY0MTgzNmNiODVlNGQ5YThhMDBlZDhhMyJ9',

    }
  };
  var req = http.request(options, function (res) {
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    // res.setEncoding('utf8');
    res.on('data', function (chunk) {

      body += chunk;

    }).on('end', function () {
      // console.log('res:'+body);
      var res = JSON.parse(body)
      // var res = eval("("+body+")")
      res.data.forEach(element => {
        var temp = {}
        temp.ZHname = element[3]
        temp.ENname = element[4]
        temp.profession=element[7]
        temp.professionName=element[8]
        result.push(temp)

        console.log(element[3]);
        console.log(element[4]);
      });
      fff++
      console.log(fff);
      if (fff > 78) {
        writeJson(result)//执行一下;
        console.log(result);
        return
      }
        start += 10
    //   data.draw = parseInt(data.draw) + 1
    //   data._ = (new Date()).valueOf()
      body=''
      getmsg(data)

      // function sleep(ms) {
      //   return new Promise(resolve => 
      //       setTimeout(resolve, ms)
      //   )
      // }
      // sleep(1000).then(()=>{

      // })

    });
  });
  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });
  // req.write(data);
  req.end()

}

getmsg(data)




function writeJson(params){
    //现将json文件读出来
 
        var str = JSON.stringify(params);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
        fs.writeFile('./professionData.json',str,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------新增成功-------------');
        })
   
}



// console.log((new Date()).valueOf());

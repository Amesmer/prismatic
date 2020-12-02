
const { JSEncrypt } = require('./jsencrypt.min.js')
let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJGqHgdGpit6bs4qJTXiNIW8Ev02butFwDXCUUUW3ZPh3Cz7cbVTHufottS+H8YfdWU/A7s1/J/A00fNk/GihVgSKmYg+1OAohYkNUVhmBi1Fjsnpz0+c/Ocd1KdiWxyYvyfELHug9yyYeDTyBvbImcO//twNET9A2mXezic9G8QIDAQAB'
let privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL0pVodeERYCZKwsX3ZzFfZYnDGOHv3dpAUyQE+WmzYdxHqyhw7zl5gbBGnqJihO6tbuIfk4lBKyRpqp75HHMAYWpWklNWtB706nZPnQHWInRlyk/DlQYM/GHsNHVqqW0ub5uUBjqcwp++zPJIp7nBFhQN6OAP9QXj84GHCUU5clAgMBAAECgYBMcE7yBrYa0b7CwG+XGuxuDuKXN9oYNh9YpjTMtIxl8uN5vXjMNu00Xv6Kmj7vHOzTC4mY/x7+6yGS0Ebp/rbNnTB2c0dJvcISDjZ9Z3doif/XtCg6QhLxYTPOpP1x/XsVa9gLKAF4vnoPSiZA1jHuKLwvZR5k9kDAVdQwCY/0BQJBAN2T8DFkHdeD+jCji0ZvF3RKUF2G3YKmt1C1vlDSvomQ5Ybi2TNgZIleql/7EXtCdZCW2ixkumuZE4YAcr0HWhcCQQDajDZmiI0yAcXPuy5kDPdZmBHFDpRcH5Sf2rgbHy1cIus8SNYGbx3VTwe3p/XA/14iyb3XYWEpgJmW4wyL2aojAkA4K9bKTp0aE4ULa4pVMrh5bJVvAE+LXYQ/W7OBfct7yFXHmh6B3b/e6za52kYWP0TagMOSWX7A5C+E2vw7W2/FAkBH6PLNcgjjd2nbHD/7c7i/piXSrSVr2ohQwOrrIasPMf4s69pga5dpZIOpjn5ybpRO5gqtH8GUolfnKfYq3gf5AkEAukiZTuoR7JIV4o26iKGueNO6ZOmbsTgIdHjL45BIfIupLuW/wnFCDZVN7L17mFWfWObDEojHMn/u6rars5ShSQ=='

// let privateKey="MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIkaoeB0amK3puziolNeI0hbwS/TZu60XANcJRRRbdk+HcLPtxtVMe5+i21L4fxh91ZT8DuzX8n8DTR82T8aKFWBIqZiD7U4CiFiQ1RWGYGLUWOyenPT5z85x3Up2JbHJi/J8Qse6D3LJh4NPIG9siZw7/+3A0RP0DaZd7OJz0bxAgMBAAECgYAQ59DIDXLEw2J42SUs5HGzTWUP0aBilKi33VfRHo1N+UPQLq6kVyf2AXKNwoqWBTprUaRQqDiKfmLecvqStlX8rlzkbZuu6mgCO1TXu0J85fxtdZcxjzawrNoIoqXyzx511lK0Ly3AtO4uLQR0keC/04enaSQ7t8+VoswI2ADdcQJBANmDUzjWGkjvGEU1u+tGSN3FY/6WEiQeEsq+6s2FwJpORuaayYvXjizXssBPE0r1wlGO2CI9Dx5dAOkfaeGoAC0CQQChXQbcjsYsYCvSuzIXDuZsb4lpbNndZWMwomw+Zl5EX18fMY411cxENtCSoiy0BEfbGHPfCqvMgqewvEdf7xhVAkEAuifb3OPYgR0n/2u6leSETlE2gFe91O1sFdsJp7XWHfnqUkidP7LO+m/siwviLiBhG14OelcZjln4gowhGUCoTQJAQOK4bJ4YwCVX2eAeTzlVnMro9XSo0qb/UMIvRpRBWbsD8/YoWiuDfPaRvjTqRuTlxAs8JLcUyCLNrXq4NLJfFQJAWmdCtPKCHz40QCF01I7W26Uz7YX3fNcsQzli6rLQIRx09EylRZswThK8tHkdV0xvmfi4wyY6ZnOOxHIaFIjr5w=="
// let publicKey  =  `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJGqHgdGpit6bs4qJTXiNIW8Ev
// 02butFwDXCUUUW3ZPh3Cz7cbVTHufottS+H8YfdWU/A7s1/J/A00fNk/GihVgSKm
// Yg+1OAohYkNUVhmBi1Fjsnpz0+c/Ocd1KdiWxyYvyfELHug9yyYeDTyBvbImcO//
// twNET9A2mXezic9G8QIDAQAB`
//十六进制转字节
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
// 字节转十六进制
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
// 十六进制转base64
function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
        c = parseInt(h.substring(i, i + 1), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (i + 2 == h.length) {
        c = parseInt(h.substring(i, i + 2), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}

// convert a base64 string to hex
function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop = 0;
    for (i = 0; i < s.length; ++i) {
        if (s.charAt(i) == b64pad) {
            break;
        }
        var v = b64map.indexOf(s.charAt(i));
        if (v < 0) {
            continue;
        }
        if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
        }
        else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
        }
        else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
        }
        else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
        }
    }
    if (k == 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}
JSEncrypt.prototype.encryptLong2 = function (string) {
    var k = this.getKey();
    try {
        var lt = "";
        var ct = "";
        //RSA每次加密117bytes，需要辅助方法判断字符串截取位置
        //1.获取字符串截取点
        var bytes = new Array();
        bytes.push(0);
        var byteNo = 0;
        var len, c;
        len = string.length;
        var temp = 0;
        for (var i = 0; i < len; i++) {
            c = string.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                byteNo += 4;
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                byteNo += 3;
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                byteNo += 2;
            } else {
                byteNo += 1;
            }
            if ((byteNo % 117) >= 114 || (byteNo % 117) == 0) {
                if (byteNo - temp >= 114) {
                    bytes.push(i);
                    temp = byteNo;
                }
            }
        }

        //2.截取字符串并分段加密
        if (bytes.length > 1) {
            for (var i = 0; i < bytes.length - 1; i++) {
                var str;
                if (i == 0) {
                    str = string.substring(0, bytes[i + 1] + 1);
                } else {
                    str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
                }
                var t1 = k.encrypt(str);
                ct += t1;
            }
            ;
            if (bytes[bytes.length - 1] != string.length - 1) {
                var lastStr = string.substring(bytes[bytes.length - 1] + 1);
                ct += k.encrypt(lastStr);
            }
            // return hexToBytes(ct);

            return hex2b64(ct)
        }
        var t = k.encrypt(string);
        // var y = hexToBytes(t);
        var y = t
        return hex2b64(y);
    } catch (ex) {
        return false;
    }
};


JSEncrypt.prototype.decryptLong2 = function (string) {
    var k = this.getKey();
    // var maxLength = ((k.n.bitLength()+7)>>3);
    var MAX_DECRYPT_BLOCK = 128;
    try {
        var ct = "";
        var t1;
        var bufTmp;
        var hexTmp;
        // var str = bytesToHex(string);
        var str =b64tohex(string) ;

        var buf = hexToBytes(str);
        var inputLen = buf.length;
        //开始长度
        var offSet = 0;
        //结束长度
        var endOffSet = MAX_DECRYPT_BLOCK;

        //分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
                bufTmp = buf.slice(offSet, endOffSet);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
                
            } else {
                bufTmp = buf.slice(offSet, inputLen);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
             
            }
            offSet += MAX_DECRYPT_BLOCK;
            endOffSet += MAX_DECRYPT_BLOCK;
        }
        return ct;
    } catch (ex) {
        return false;
    }
};

export default {
    // // 加密
    setEncrypt: (pas) => {
        //实例化jsEncrypt对象
        let jse = new JSEncrypt();
        //设置公钥
        jse.setPublicKey(publicKey);
        // console.log('加密：'+jse.encrypt(pas))
        return jse.encryptLong2(encodeURIComponent(JSON.stringify(pas)));
     

    },
    // // 解密
   decrypt:   (pas) => {

        let jse = new JSEncrypt();
        // 私钥
      jse.setPrivateKey(privateKey)
        // console.log('解密：'+jse.decrypt(pas))
        return decodeURIComponent(jse.decryptLong2(pas)) ;



     
      
    }

}






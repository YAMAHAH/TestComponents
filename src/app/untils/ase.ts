let out = function (args: any) {
    var args = Array.prototype.slice.call(arguments, 0);
    document.getElementById('output').innerHTML += args.join(" ") + "\n";
};

let privateKey: string = "Foo";
let pin: string = "Bar";
let data: string = "0VzMi44AGyONi4MoKvr3rQ==";

// Begin decryption
function decrypt(privateKey: string, pin: string, data: string) {
    let cipherBuffer: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(data);

    let keyHash: CryptoJS.lib.WordArray = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(privateKey));
    let key: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(keyHash.words.slice(0, 8), 32);

    let pinHash: CryptoJS.lib.WordArray = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(pin));
    let iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(pinHash.words.slice(0, 4), 16);

    let cfg: CryptoJS.lib.IBlockCipherCfg = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };

    let paramsData: CryptoJS.lib.CipherParamsData = {
        ciphertext: cipherBuffer
    };
    return CryptoJS.AES.decrypt(paramsData, key, cfg);
}

interface user {
    name: string,
    password: string
}

let model: user = { name: "", password: "" };

function decryptToUtf8String(privateKey: string, pin: string, data: string) {
    return decrypt(privateKey, pin, data).toString(CryptoJS.enc.Utf8);
}


// End decryption

// Begin encryption
function Encrypt(privateKey: string, pin: string, data: string) {

    let keyHash: CryptoJS.lib.WordArray = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(privateKey));
    let key: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(keyHash.words.slice(0, 8), 32);
    let pinHash: CryptoJS.lib.WordArray = CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(pin));
    let iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(pinHash.words.slice(0, 4), 16);
    let cfg: CryptoJS.lib.IBlockCipherCfg = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    let encrypted = CryptoJS.AES.encrypt(data, key, cfg);
    return encrypted.ciphertext;
}

function EncryptToBase64String(privateKey: string, pin: string, data: string) {
    return Encrypt(privateKey, pin, data).toString(CryptoJS.enc.Base64);
}

// End encryption

out(decrypt(privateKey, pin, data).toString(CryptoJS.enc.Utf8));
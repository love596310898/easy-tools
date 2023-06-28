import CryptoJS from "crypto-js";

//=================================================//
//                      DES                        //
//=================================================//

// DES
const DESKey = "EverSec!@#$&4567";
/**
 * 加密
 * @param {*} message
 */
export function encryptDES(message) {
  let keyHex = CryptoJS.enc.Utf8.parse(DESKey);
  let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
}

/**
 * 解密
 * @param {*} message
 */
export function decryptDES(message) {
  let keyHex = CryptoJS.enc.Utf8.parse(DESKey);
  let decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(message)
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

//=================================================//
//                      AES                        //
//=================================================//
// AES
const initAESKey = "EverSec!@#$&4567";
// 设置数据块长度
const keySize = 128;

/**
 * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
 * @param {string} key - 原始 key 值
 * @return Buffer
 */
function fillKey(key) {
  const filledKey = Buffer.alloc(keySize / 8);
  const keys = Buffer.from(key);
  if (keys.length <= filledKey.length) {
    filledKey.map((b, i) => (filledKey[i] = keys[i]));
  }

  return filledKey;
}

const AESKey = CryptoJS.enc.Utf8.parse(fillKey(initAESKey));

/**
 * 定义加密函数
 * @param {string} data - 需要加密的数据, 传过来前先进行 JSON.stringify(data);
 * @param {string} key - 加密使用的 key
 */
export function encryptAES(data) {
  let key = AESKey;
  /**
   * CipherOption, 加密的一些选项:
   *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
   *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
   *   iv: 偏移量, mode === ECB 时, 不需要 iv
   * 返回的是一个加密对象
   */
  const cipher = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ""
  });
  // 将加密后的数据转换成 Base64
  const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Hex);
  const resultCipher = base64Cipher;
  // 返回加密后的经过处理的 Base64
  return resultCipher;
}

/**
 * 定义解密函数
 * @param {string} encrypted - 加密的数据;
 * @param {string} key - 加密使用的 key
 */
export function decryptAES(encrypted) {
  let key = AESKey;
  const restoreHex = CryptoJS.enc.Hex.parse(encrypted);
  const restoreBase64 = CryptoJS.enc.Base64.stringify(restoreHex);
  // 这里 mode, padding, iv 一定要跟加密的时候完全一样
  // 返回的是一个解密后的对象
  const decipher = CryptoJS.AES.decrypt(restoreBase64, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ""
  });
  // 将解密对象转换成 UTF8 的字符串
  const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher);
  // 返回解密结果
  return resultDecipher;
}
// // 获取填充后的key
// const key = CryptoJS.enc.Utf8.parse(fillKey(initKey));

// // 定义需要加密的数据
// const data = {"password":"qwe123!@#","userName":"wing@email.com"};
// // 调用加密函数
// const encrypted = encryptAES(data);
// // 调用解密函数
// const decrypted = decryptAES(encrypted);
// // 控制台输出查看结果
// console.log('加密结果: ', encrypted);
// console.log('解密结果: ', decrypted);

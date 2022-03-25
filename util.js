const fs = require('fs')
const request = require('request');
const gm = require('gm').subClass({imageMagick: true});
const screenshot = require('screenshot-desktop')
const asciify = require('asciify-image');

let size = 1000 //你要发行多个nft
let jsonSavePath = './assets/nft_json'; //存储json文件的位置
let blindBoxPath = './assets/nft_json_blind_box'; //存盲盒json的位置
let imageSavePath = './assets/images'; //存下载图片的位置
let imageScreenPath = './assets/image_screen'; //存储截图的位置
let imagesAsciiPath = './assets/images_ascii'; //存储最终裁剪的图片的位置

//创建文件夹
(async function () {
    if (!await fs.existsSync('./assets')) {
        await fs.mkdirSync('./assets')
        if (!await fs.existsSync(jsonSavePath)) {
            fs.mkdirSync(jsonSavePath)
            fs.mkdirSync(blindBoxPath)
            fs.mkdirSync(imageSavePath)
            fs.mkdirSync(imageScreenPath)
            fs.mkdirSync(imagesAsciiPath)
        }
    }
})();

//==============注意===============
//下面几个函数按顺序执行就可以
//可以优化但是没时间了

/**
 * 1、下载其他项目的json描述文件
 * 这个演示项目是下载【无聊猿】的，也可以下载其他的
 * @param i
 */
let baseUrl = 'https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.dweb.link/'
let counter1 = 0

function saveFile(i) {
    request(baseUrl + i).pipe(fs.createWriteStream(`${jsonSavePath}/${i}`)).on("close", function (err) {
        console.log("json文件[" + i + "]下载完毕");
        counter1++
        if (counter1 < size) {
            saveFile(counter1)
        }
    });
}

/**
 * 2、根据json里面的路径下载图片
 * @param i
 */
let counter2 = 0

function saveImage(i) {
    let data = fs.readFileSync(`${jsonSavePath}/${i}`)
    data = JSON.parse(data.toString())
    let imageUrl = data.image;
    let cid = imageUrl.split('ipfs://')[1];
    let url = `http://ipfs.io/ipfs/${cid}`;//网关也可以找其他的
    request(url).pipe(fs.createWriteStream(`./${imageSavePath}/${i}.png`)).on("close", function (err) {
        console.log("文件[" + i + ".png]下载完毕");
        counter2++
        if (counter2 < size) {
            saveImage(counter2)
        }
    })
}

/**
 * 3、转换、截图、裁剪保存
 * 没有找到好的办法吧转换出来的Ascii图形转换成图片，所以在控制台打印截图了，然后用gm库在裁剪，注意
 * - 最好新开一个控制台比如windows下开cmd，然后全屏执行
 * - 电脑要安装ImageMagick和GraphicsMagick
 * https://imagemagick.org/script/download.php#windows
 * https://sourceforge.net/projects/graphicsmagick/files/graphicsmagick-binaries/1.3.36/

 * @param i
 * @returns {Promise<void>}
 */
let counter3 = 0

async function buildImg(i) {
    //这个就自己去看文档了，
    let options = {
        fit: 'width',
        width: 60,
        height: 60
    }
    //转换成ascii图形
    let asciifyData = await asciify(`${imageSavePath}/${i}.png`, options)
    console.log(asciifyData);
    //截图
    let screenshotData = await screenshot({format: 'png', filename: `${imageScreenPath}/${i}.png`})
    console.log(screenshotData);
    //清屏
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    //裁剪，大小自己定
    //不过要主要这四个参数 x y w h
    gm(`${imageScreenPath}/${i}.png`)
        .crop(959, 959, 0, 58)
        .write(`${imagesAsciiPath}/${i}.png`, function (err) {
            console.log(`${imagesAsciiPath}/${i}.png` + ' finished!');
            counter3++
            if (counter3 < size) {
                buildImg(counter3)
            }
        })
}


/**
 * 4、修改图片路径
 * 先将所有图片上传拿到cid
 * @param index
 * @returns {Promise<void>}
 */
let imageFolderCId = 'QmPaGFH8cf8vvkMYqayixUkWP7baTLTWLraqW2Y8Uss7bk';
let counter4 = 0

async function setFile(index) {
    let file = `${jsonSavePath}/${index}`
    let data = fs.readFileSync(file)
    data = JSON.parse(data.toString())
    data.image = 'ipfs://' + imageFolderCId + '/' + index + '.png'
    await fs.writeFileSync(file, JSON.stringify(data))
    console.log(index + ' finished---> ' + data.image)
    counter4++
    if (counter4 < size) {
        setFile(counter4)
    }
}

/**
 * 5、设置盲盒json
 * 这里随便设置一张图就可以了
 * @returns {Promise<void>}
 */

let blindBoxCid = 'QmTXj2vxPZpqiZKaq3dFtToNc279cMHZc5Qsb9vp3YGhAR'

async function setBlindBox() {
    for (let i = 0; i < size; i++) {
        await fs.writeFileSync(blindBoxPath + '/' + i, JSON.stringify({
            "name": "ApeAscii",
            "image": "ipfs://" + blindBoxCid,
        }))
    }
}
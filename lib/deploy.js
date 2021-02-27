const OSS = require('ali-oss')
const fs = require('fs')
const path = require('path')

function init({ staticPath = '', ossConfig: { region, accessKeyId, accessKeySecret, bucket, ...restOssConfig }, ossPath, recursion = true }) {
  staticPath = path.resolve(__dirname, `../../../${staticPath}`)
  fs.stat(staticPath, function (err, data) {
    if (err) {
      console.log(`${staticPath}不存在,请检查!`)
      process.exit(1)
    }
  })

  if (!region) {
    console.log('请配置oss存储地区')
    process.exit(1)
  }

  if (!bucket) {
    console.log('请配置oss bucket')
    process.exit(1)
  }

  if (!accessKeyId || !accessKeySecret) {
    console.log('请配置oss账号信息')
    process.exit(1)
  }

  if (!ossPath) {
    ossPath = ''
  }

  const store = OSS({
    region, //oss地区名
    accessKeyId,
    accessKeySecret,
    bucket, //bucket name
    ...restOssConfig,
  })

  deploy({ staticPath, ossPath, recursion, store })
}

function uploadAliyun({ fileName, filepath, store }) {
  store
    .put(fileName, fs.createReadStream(filepath))
    .then((res) => {
      console.log(`${fileName}上传成功`)
    })
    .catch((err) => {
      console.log(`${fileName}上传失败,请检查oss配置信息是否有误`)
    })
}

function deploy({ staticPath, ossPath, recursion, store }) {
  fs.readdir(staticPath, function (err, files) {
    if (err) {
      return
    }
    files.forEach((file) => {
      const filepath = path.join(staticPath, file)
      fs.stat(filepath, function (err, data) {
        if (err) {
          return
        }
        if (data.isFile()) {
          uploadAliyun({ fileName: ossPath + '/' + file, filepath, store })
        } else {
          if (recursion) {
            const curDirOssPath = ossPath + '/' + file
            deploy({ staticPath: filepath, ossPath: curDirOssPath, recursion, store })
          }
        }
      })
    })
  })
}

module.exports = init

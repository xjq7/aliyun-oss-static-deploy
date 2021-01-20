const deploy = require('aliyun-oss-static-deploy')

deploy({
  ossConfig: {
    region: 'your region', //oss地区名
    accessKeyId: 'your accessKeyId',
    accessKeySecret: 'your accessKeySecret',
    bucket: 'your bucket',
  },
  //  最好同时配置staticPath,ossPath,确定上传文件路径以及存储路径
  staticPath: 'your staticPath', // 默认为根路径
  ossPath: 'your ossPath', // oss存储路径,默认是根路径,
  recursion: true, // 递归上传,默认为true,文件夹下所有文件递归上传
})

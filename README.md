# fs_aso

> aso

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

## OSS访问地址
#### kodecoffee-fronted
https://fronted.kodecoffee.com 
#### kodecoffee-cdn
https://kodecoffee-global.zingfront.com


## 代码发布方式
#### 正式环境:
1.  本地打包npm run build:prod
2. static/index 上传到OSS/kodecoffee-fronted跟路径
3. static整个文件上传到OSS/kodecoffee-cdn跟路径
#### 测试环境:
1. config/index dev配置 ```assetsPublicPath: 'https://dev.kodecoffee.com/vendors/',```
2. 本地打包npm run build:dev
3. static文件替换kodecoffee_vendors项目 /app/static 全部文件
4. jsm拉代码  ```docker restart 78d599353a00```
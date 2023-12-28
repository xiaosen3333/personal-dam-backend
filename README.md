# personal-dam-backend
基于foalts框架的数字媒体资源管理系统后端
# 安装
## 安装依赖包
```shell
npm i
```
## 创建数据库
```
npm run makemigrations
npm run migrations
```
## 创建资源文件夹
因为public中资源太多，所以没有上传，请按如下格式创建文件夹
```
public
├── musics
│   ├── urls
│   └── covers
|   └── texts
├── images
│   ├── urls
│   └── covers
├── videos
│   ├── urls
│   └── covers
```

## 启动后端
```
npm run dev
```


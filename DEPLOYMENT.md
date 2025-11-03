# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1️⃣ 启用 GitHub Pages

1. 打开你的GitHub仓库: https://github.com/varedias/TaxVisible
2. 点击顶部的 **Settings**（设置）标签
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下拉菜单中选择 **GitHub Actions**
5. 保存设置

### 2️⃣ 等待自动部署

- GitHub Actions 会自动开始部署
- 访问 **Actions** 标签查看部署进度
- 首次部署大约需要 1-3 分钟

### 3️⃣ 访问你的网站

部署完成后，你的网站将可以通过以下地址访问：

```
https://varedias.github.io/TaxVisible/
```

或者直接访问主页：

```
https://varedias.github.io/TaxVisible/index.html
```

二维码生成器（测试工具）：

```
https://varedias.github.io/TaxVisible/qr-generator.html
```

## ✅ 优势

✅ **完全免费** - GitHub Pages 永久免费
✅ **自动部署** - 每次 push 自动更新
✅ **支持 HTTPS** - 摄像头功能需要 HTTPS
✅ **CDN 加速** - 全球访问速度快
✅ **无需服务器** - 零运维成本

## 📱 分享给其他人

只需要将以下链接发送给别人：

```
https://varedias.github.io/TaxVisible/
```

他们就可以在手机或电脑上打开并使用：
1. 📷 扫描二维码识别价格和税率
2. ✍️ 或手动输入
3. 🎬 观看Unity动画展示

## 🔧 更新网站

以后每次修改代码，只需要：

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动重新部署，1-3分钟后网站就会更新。

## 🎯 测试二维码功能

1. 在电脑上打开: https://varedias.github.io/TaxVisible/qr-generator.html
2. 生成测试二维码
3. 用另一台设备扫描或打开主页面扫描屏幕上的二维码

## ⚠️ 注意事项

### 摄像头权限
- ✅ HTTPS 自动启用（GitHub Pages提供）
- ✅ 第一次访问时浏览器会请求摄像头权限，请点击"允许"
- ✅ 移动设备请使用现代浏览器（Chrome、Safari、Edge）

### Unity文件大小
- Unity WebGL 文件较大（约 20-30MB）
- 首次加载可能需要几秒钟
- 建议在 WiFi 环境下访问

### 浏览器兼容性
- ✅ Chrome 90+ （推荐）
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Firefox 88+

## 📊 查看访问统计

可以在 GitHub 仓库的 **Insights > Traffic** 查看访问量。

## 🌐 绑定自定义域名（可选）

如果你有自己的域名，可以在 Settings > Pages > Custom domain 中设置。

例如：`tax.yourdomain.com`

## 🆘 故障排除

### 问题1: 404 错误
**解决**: 确保在 Settings > Pages 中选择了 "GitHub Actions" 作为 Source

### 问题2: 摄像头无法打开
**解决**: 
- 检查浏览器权限设置
- 确保使用 HTTPS (GitHub Pages 自动提供)
- 尝试使用无痕模式

### 问题3: Unity 加载失败
**解决**: 
- 检查浏览器控制台错误信息
- 确认 Unity/Build/ 文件夹中的所有文件都已上传
- 清除浏览器缓存后重试

### 问题4: 部署失败
**解决**: 
- 访问 Actions 标签查看详细错误
- 确保 .github/workflows/deploy.yml 文件正确
- 检查仓库 Settings > Actions > General 中是否允许 Actions

## 📞 获取帮助

如遇问题，可以：
1. 查看 GitHub Actions 的部署日志
2. 在仓库中提交 Issue
3. 检查浏览器控制台的错误信息

---

**部署时间**: 2025-01-03
**仓库地址**: https://github.com/varedias/TaxVisible
**网站地址**: https://varedias.github.io/TaxVisible/

# 🚀 使用国内CDN加速Unity文件

## 📦 步骤1：上传到jsDelivr（免费CDN）

jsDelivr 会自动加速 GitHub 上的文件。

### 你的Unity文件CDN地址：

```
原地址（慢）:
https://varedias.github.io/TaxVisible/Unity/Build/Unity.data.unityweb

CDN加速地址（快）:
https://cdn.jsdelivr.net/gh/varedias/TaxVisible@main/Unity/Build/Unity.data.unityweb
```

### 完整CDN地址：

```javascript
// Unity.data
https://cdn.jsdelivr.net/gh/varedias/TaxVisible@main/Unity/Build/Unity.data.unityweb

// Unity.framework.js
https://cdn.jsdelivr.net/gh/varedias/TaxVisible@main/Unity/Build/Unity.framework.js.unityweb

// Unity.wasm
https://cdn.jsdelivr.net/gh/varedias/TaxVisible@main/Unity/Build/Unity.wasm.unityweb

// Unity.loader.js
https://cdn.jsdelivr.net/gh/varedias/TaxVisible@main/Unity/Build/Unity.loader.js
```

---

## 📊 速度对比：

### GitHub Pages（当前）：
- 速度：0.1 MB/s
- 下载15.5MB：**2.5分钟** ⏰

### jsDelivr CDN：
- 速度：1-5 MB/s
- 下载15.5MB：**3-15秒** ✅

**提升 10-50 倍！**

---

## 🔧 修改方案

我会修改代码，自动使用CDN加速。

优先顺序：
1. 首先尝试 jsDelivr CDN（快）
2. 如果CDN失败，降级到 GitHub Pages（慢但稳定）

---

## ✅ 优势：

- ✅ 完全免费
- ✅ 中国大陆有节点
- ✅ 自动同步GitHub更新
- ✅ 无需额外配置

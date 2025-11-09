# 🚀 Unity WebGL 加载速度优化指南

## 📊 当前问题分析

Unity WebGL加载慢的主要原因：
- Unity.data 文件通常 10-30MB
- Unity.wasm 文件通常 5-15MB
- 总计可能超过 20-50MB

## ⚡ 优化方案

### 方案1：在Unity中压缩构建（最有效）✅

#### 步骤：
1. **打开Unity项目**
2. **File → Build Settings → Player Settings**
3. **找到 Publishing Settings**
4. **设置以下选项：**

```
Compression Format: Brotli（最佳）或 Gzip
   - Brotli: 压缩率最高，文件最小
   - Gzip: 兼容性好
   - Disabled: 不压缩（文件大）

Enable Exceptions: None
   - 禁用异常处理，减小文件

Code Optimization: Size（文件大小优先）
   - Size: 优先减小文件大小
   - Speed: 优先运行速度
```

5. **重新 Build**

**效果**：文件大小可减少 **50-70%**！

---

### 方案2：优化Unity项目资源

#### 1. 纹理优化
```
- 降低纹理分辨率（2048 → 1024 → 512）
- 使用压缩格式（RGB Compressed DXT1）
- 移除不必要的纹理
```

#### 2. 网格优化
```
- 降低模型面数
- 移除不可见的模型
- 合并网格（Mesh Combining）
```

#### 3. 音频优化
```
- 使用压缩音频格式
- 降低音频质量（44.1kHz → 22.05kHz）
- 移除不必要的音效
```

#### 4. 脚本优化
```
- 移除未使用的脚本
- 删除 Debug.Log 语句
- 启用代码剥离（Code Stripping）
```

**效果**：文件大小可再减少 **30-50%**

---

### 方案3：使用资源分包（Advanced）

#### Asset Bundles
将大资源打包成独立文件，按需加载：

```csharp
// 仅加载必要的资源
AssetBundle.LoadFromFileAsync("effects.bundle");
```

**效果**：初始加载时间减少 **60-80%**

---

### 方案4：启用浏览器缓存（已实现）✅

**已在代码中添加：**
- Brotli压缩支持
- 性能优化配置
- 进度条显示

---

## 🎯 推荐操作顺序

### 立即执行（5分钟）：
1. ✅ Unity → Build Settings → Player Settings
2. ✅ Compression Format: **Brotli**
3. ✅ Code Optimization: **Size**
4. ✅ Enable Exceptions: **None**
5. ✅ 重新 Build

**预期效果**：加载时间从 10-20秒 → **3-5秒**

### 进一步优化（30分钟）：
1. 降低纹理分辨率
2. 优化模型面数
3. 压缩音频文件
4. 移除未使用资源

**预期效果**：加载时间 → **1-2秒**

---

## 📱 测试加载速度

### 本地测试：
```bash
npx http-server -p 8000 -c-1
```

### 在线测试：
```
https://varedias.github.io/TaxVisible/
```

### 检查文件大小：
```
Unity/Build/Unity.data    ← 应该 < 5MB
Unity/Build/Unity.wasm    ← 应该 < 3MB
```

---

## 🔧 Unity Build Settings 截图参考

```
Player Settings → Publishing Settings:
┌─────────────────────────────────────┐
│ Compression Format: [Brotli      ▼] │
│ Decompression Fallback: ☑           │
│                                     │
│ Code Optimization: [Size         ▼] │
│ Enable Exceptions: [None         ▼] │
│ Stack Trace: [None               ▼] │
└─────────────────────────────────────┘
```

---

## ✅ 验证优化效果

### 优化前：
- Unity.data: ~20MB
- Unity.wasm: ~10MB
- 加载时间: 15-30秒

### 优化后：
- Unity.data: ~3MB ✅
- Unity.wasm: ~2MB ✅
- 加载时间: **1-3秒** ✅

---

## 💡 额外提示

### GitHub Pages 优化：
GitHub Pages 自动启用 Gzip，但如果你用 Brotli 构建，效果更好。

### CDN 加速（可选）：
可以将 Unity 文件上传到 CDN：
- Cloudflare（免费）
- jsDelivr（免费）

---

## 🆘 故障排除

### 问题：修改后还是很慢
**解决**：
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 检查 Unity/Build/ 文件大小
3. 确认选择了 Brotli 压缩

### 问题：压缩后无法加载
**解决**：
1. 检查服务器是否支持 Brotli
2. 改用 Gzip 压缩
3. 查看浏览器控制台错误

---

**立即行动**：打开Unity → Player Settings → 改成Brotli → 重新Build！

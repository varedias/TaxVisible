# 📱 Unity WebGL 移动端优化指南

## 🔍 当前问题
- **文件大小**: 17 MB
- **手机4G网络**: 下载需要 10-30秒
- **手机5G/WiFi**: 下载需要 3-10秒

## 🎯 优化目标
- **目标文件大小**: < 5 MB
- **加载时间**: < 3 秒

---

## ⚡ 立即优化（在Unity中）

### 1️⃣ 删除未使用的资源（最有效）

**检查并删除：**
```
✅ 未使用的3D模型
✅ 未使用的纹理贴图
✅ 未使用的音频文件
✅ 未使用的动画
✅ 未使用的脚本
```

**如何检查：**
1. 右键点击 Assets 文件夹
2. 选择 "Select Dependencies"
3. 删除没有被选中的文件

---

### 2️⃣ 纹理优化（效果显著）

**当前纹理设置可能是：**
```
格式: RGBA 32 bit
分辨率: 2048x2048 或更高
```

**优化为：**
```
┌─────────────────────────────────────┐
│ Texture Import Settings             │
├─────────────────────────────────────┤
│ Max Size: 512 (或 1024)            │ ← 降低分辨率
│ Format: RGB Compressed DXT1         │ ← 使用压缩
│ Compression: High Quality           │
└─────────────────────────────────────┘
```

**步骤：**
1. 选中所有纹理文件
2. Inspector → Max Size: 512
3. Format: DXT1 (不需要透明) 或 DXT5 (需要透明)
4. Apply

**效果：文件大小减少 70-90%**

---

### 3️⃣ 模型优化

**检查模型面数：**
```
选中模型 → Inspector → 查看 Vertices 和 Triangles 数量
```

**优化标准：**
```
简单物体: < 500 三角形
复杂物体: < 2000 三角形
主要角色: < 5000 三角形
```

**如果超过，使用：**
- Blender 中的 Decimate Modifier
- Unity 的 Mesh Simplifier (Asset Store)

---

### 4️⃣ 音频优化

**当前设置可能是：**
```
格式: WAV/MP3
质量: 高品质
采样率: 44100 Hz
```

**优化为：**
```
┌─────────────────────────────────────┐
│ Audio Import Settings               │
├─────────────────────────────────────┤
│ Load Type: Streaming                │
│ Compression Format: Vorbis          │
│ Quality: 50% (背景音)               │
│ Quality: 70% (重要音效)             │
│ Sample Rate: 22050 Hz               │
└─────────────────────────────────────┘
```

**效果：音频文件减少 80-90%**

---

### 5️⃣ Unity Build Settings（Unity 6）

确保这些设置已启用：

```
Edit → Project Settings → Player → WebGL

┌─────────────────────────────────────┐
│ Publishing Settings                 │
├─────────────────────────────────────┤
│ ✅ Compression Format: Brotli       │
│ ✅ Decompression Fallback           │
│ ✅ WebAssembly Streaming            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Other Settings → Optimization       │
├─────────────────────────────────────┤
│ Managed Stripping Level: High       │
│ IL2CPP Code Generation:             │
│   Faster (smaller) builds           │
│ Enable Exceptions: None             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Quality Settings                    │
├─────────────────────────────────────┤
│ Edit → Project Settings → Quality  │
│                                     │
│ 对于 WebGL 平台:                    │
│ - Pixel Light Count: 1             │
│ - Texture Quality: Half Res        │
│ - Anti Aliasing: Disabled          │
│ - Shadows: Disable Shadows         │
└─────────────────────────────────────┘
```

---

### 6️⃣ 移除不必要的包

**检查 Package Manager：**
```
Window → Package Manager

移除不需要的包：
❌ Unity Recorder
❌ Test Framework
❌ Visual Scripting (如果不用)
❌ Input System (如果用的是旧系统)
```

---

### 7️⃣ 代码优化

**移除调试代码：**
```csharp
// 删除所有 Debug.Log
// 删除所有 print
// 删除未使用的 using 语句
```

**使用条件编译：**
```csharp
#if UNITY_EDITOR
    Debug.Log("仅在编辑器中运行");
#endif
```

---

## 📊 预期优化效果

### 优化前：
```
Unity.data.unityweb:     9.44 MB
Unity.wasm.unityweb:     7.51 MB
Unity.framework.unityweb: 0.07 MB
总计:                   ~17 MB
```

### 优化后（目标）：
```
Unity.data.unityweb:     2-3 MB  ✅ (减少 70%)
Unity.wasm.unityweb:     1-2 MB  ✅ (减少 70%)
Unity.framework.unityweb: 0.07 MB
总计:                   ~4-5 MB ✅
```

### 加载时间：
```
手机4G: 从 15-30秒 → 3-5秒
手机5G: 从 5-10秒 → 1-2秒
WiFi:   从 3-5秒 → 1秒内
```

---

## 🚀 快速优化清单

### ✅ 必做（5分钟）
1. [ ] 纹理 Max Size 改为 512
2. [ ] 音频压缩改为 Vorbis 50%
3. [ ] Build Settings 启用 Brotli
4. [ ] 删除未使用的资源

### ⭐ 推荐（15分钟）
5. [ ] 降低模型面数
6. [ ] 移除不需要的 Package
7. [ ] Quality Settings 降低
8. [ ] 删除 Debug.Log

### 🎯 高级（30分钟）
9. [ ] 使用 Asset Bundle 按需加载
10. [ ] 优化着色器
11. [ ] 合并网格
12. [ ] 使用对象池

---

## 📱 移动端特别优化

### 针对手机的额外设置：

```csharp
// 在 Unity 脚本中检测移动设备
void Start()
{
    #if UNITY_WEBGL && !UNITY_EDITOR
    if (IsMobile())
    {
        // 降低质量设置
        QualitySettings.SetQualityLevel(0);
        Application.targetFrameRate = 30;
    }
    #endif
}

bool IsMobile()
{
    return Application.platform == RuntimePlatform.Android || 
           Application.platform == RuntimePlatform.IPhonePlayer;
}
```

---

## 🔧 立即执行步骤

### 1. 优化纹理（最快见效）
```
1. Assets 文件夹中找到所有图片
2. Ctrl+A 全选
3. Inspector → Max Size: 512
4. Format: DXT1/DXT5
5. Apply
```

### 2. 优化音频
```
1. 找到所有音频文件
2. 全选
3. Compression Format: Vorbis
4. Quality: 50
5. Apply
```

### 3. 重新构建
```
1. File → Build Profiles
2. 选择 WebGL
3. Build
4. 输出到 f:\WebPage\Unity\Build
```

### 4. 检查文件大小
```powershell
cd f:\WebPage\Unity\Build
dir
```

**目标：总大小 < 5 MB**

---

## ✅ 验证优化

构建完成后，在 PowerShell 中运行：

```powershell
cd f:\WebPage\Unity\Build
Get-ChildItem *.unityweb | Measure-Object -Property Length -Sum | Select-Object @{Name="Total(MB)";Expression={[math]::Round($_.Sum/1MB, 2)}}
```

**如果显示 < 5 MB，优化成功！** 🎉

---

## 💡 额外建议

### 使用占位符动画
在文件较大的情况下，可以：
1. 创建一个超简化版本（< 1 MB）
2. 用户首次访问显示简化版
3. 后台加载完整版
4. 下次访问直接用缓存

### 考虑使用视频
如果动画是预渲染的，考虑：
- 导出为 WebM 视频（< 2 MB）
- 比 Unity WebGL 小很多
- 加载快得多

---

**立即行动：纹理改512 + 音频压缩 → 重新Build → 文件大小减半！**

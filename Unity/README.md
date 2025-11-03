# Unity WebGL 构建文件目录

## 说明
请将Unity WebGL导出的构建文件放置在此目录的 `Build` 文件夹中。

## 目录结构
```
unity/
└── Build/
    ├── WebGL.loader.js      (Unity加载器)
    ├── WebGL.data           (游戏数据)
    ├── WebGL.framework.js   (Unity框架)
    └── WebGL.wasm           (WebAssembly文件)
```

## Unity构建步骤

### 1. 准备Unity项目
1. 打开你的Unity项目
2. 确保已添加 `UnityIntegration.cs` 脚本到项目中
3. 在场景中创建GameObject并附加 `PriceDisplayManager` 脚本
4. 配置UI和动画组件

### 2. 构建设置
1. **File > Build Settings**
2. 选择 **WebGL** 平台
3. 如果是首次构建WebGL,点击 **Switch Platform**
4. 点击 **Player Settings** 进行配置:

#### Player Settings 配置
```
Company Name: YourCompany
Product Name: PriceCalculator
Version: 1.0

Resolution and Presentation:
- WebGL Template: Minimal (或 Default)
- Default Canvas Width: 960
- Default Canvas Height: 600

Publishing Settings:
- Compression Format: Brotli (推荐) 或 Gzip
- Enable Exceptions: None (优化性能)
- Data Caching: 勾选 (启用缓存)
```

### 3. 构建WebGL
1. 在 Build Settings 中点击 **Build**
2. 选择输出目录为: `f:\WebPage\unity\Build`
3. 等待构建完成

### 4. 验证构建文件
构建完成后,检查以下文件是否存在:
- ✅ `unity/Build/WebGL.loader.js`
- ✅ `unity/Build/WebGL.data`
- ✅ `unity/Build/WebGL.framework.js`
- ✅ `unity/Build/WebGL.wasm`

### 5. 测试
1. 运行Web服务器: `python -m http.server 8000`
2. 访问: `http://localhost:8000`
3. 输入价格和税率
4. 点击"进入动画展示"
5. 检查Unity是否正确加载和显示

## Unity脚本配置

### PriceDisplayManager GameObject
确保场景中有一个名为 `PriceDisplayManager` 的GameObject,并附加以下组件:

1. **PriceDisplayManager.cs** 脚本
2. 在Inspector中配置:
   - Price Text: TextMeshPro组件用于显示价格
   - Price Animator: Animator组件(可选)
   - Animation Duration: 2秒
   - Celebration Particles: 粒子系统(可选)
   - Sound Effect: AudioSource(可选)

### 通信测试
在Unity Editor的Console中,你应该能看到:
- "收到网页传来的价格: xxx"
- "设置目标价格: ¥xxx.xx"
- "开始播放价格动画: ¥xxx.xx"
- "价格动画播放完成"

## 常见问题

### Q: Unity文件未找到
**A:** 确保:
1. 构建目录正确: `f:\WebPage\unity\Build`
2. 所有必需文件都存在
3. 文件名与代码中的配置匹配

### Q: Unity加载失败
**A:** 检查:
1. 浏览器Console中的错误信息
2. 是否使用了本地服务器(不能直接打开HTML文件)
3. Unity版本是否为2020.3+

### Q: 无法发送数据到Unity
**A:** 验证:
1. GameObject名称是否为 `PriceDisplayManager`
2. 方法名是否正确: `SetPrice`, `PlayAnimation`
3. Unity是否已完全加载

### Q: 动画不播放
**A:** 检查:
1. Unity Console中的日志
2. 是否调用了 `PlayAnimation` 方法
3. Animator是否正确配置

## 优化建议

### 减小构建大小
1. **压缩设置**: 使用Brotli压缩
2. **代码剥离**: Player Settings > Strip Engine Code
3. **IL2CPP优化**: 使用IL2CPP而非Mono

### 提高加载速度
1. **启用缓存**: Data Caching
2. **资源优化**: 压缩纹理和音频
3. **代码优化**: 移除未使用的代码

### 提升性能
1. **降低分辨率**: 根据需要调整Canvas大小
2. **优化渲染**: 使用轻量级Shader
3. **减少Draw Calls**: 合并Mesh

## 更新Unity版本

如果使用不同的Unity版本,可能需要调整加载代码。

### Unity 2021+ (新版本)
```javascript
const buildUrl = "unity/Build";
const config = {
    dataUrl: buildUrl + "/Build.data",
    frameworkUrl: buildUrl + "/Build.framework.js",
    codeUrl: buildUrl + "/Build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "YourCompany",
    productName: "PriceCalculator",
    productVersion: "1.0",
};
```

### Unity 2019 (旧版本)
```javascript
UnityLoader.instantiate("unity-canvas", "unity/Build/Build.json");
```

## 支持
如有问题,请查看:
1. Unity官方文档: https://docs.unity3d.com/Manual/webgl-building.html
2. 项目README.md
3. Unity Console日志

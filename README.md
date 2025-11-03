# 智能商品税价计算系统

通过摄像头识别商品价格和税率,计算税价并通过Unity动画展示的完整Web应用。

## 功能特性

1. **摄像头识别**
   - 启动/停止摄像头
   - 拍照识别商品价格和税率
   - 支持自动OCR识别(需集成OCR服务)

2. **税价计算**
   - 自动计算税后价格
   - 实时更新计算结果
   - 支持手动输入修正

3. **Unity动画集成**
   - 将税价数据发送到Unity
   - 播放价格滚动动画
   - 支持特效和音效

4. **历史记录**
   - 保存最近10条计算记录
   - 支持重播历史数据
   - 本地存储持久化

## 文件说明

### Web端文件
- `index.html` - 主页面HTML结构
- `styles.css` - 样式表
- `script.js` - JavaScript主逻辑

### Unity端文件
- `UnityIntegration.cs` - Unity与Web通信的C#脚本
  - `PriceDisplayManager` - 主管理器类
  - `NumberScrollEffect` - 数字滚动特效组件

## 安装和使用

### 1. Web端设置

#### 基础运行
```bash
# 使用本地服务器运行(推荐)
# Python 3
python -m http.server 8000

# 或使用Node.js
npx http-server -p 8000

# 然后访问 http://localhost:8000
```

#### OCR识别集成
项目支持多种OCR识别方案:

**方案A: Tesseract.js (本地识别)**
```html
<!-- 在index.html中添加 -->
<script src='https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js'></script>
```

```javascript
// 在script.js的recognizeImage函数中实现
const { createWorker } = Tesseract;
const worker = await createWorker();
await worker.loadLanguage('eng+chi_sim');
await worker.initialize('eng+chi_sim');
const { data: { text } } = await worker.recognize(imageBlob);
await worker.terminate();
// 解析text提取价格和税率
```

**方案B: 云端API (推荐用于生产环境)**
```javascript
// 百度OCR示例
async function recognizeImage(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob);
    
    const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
    });
    
    const data = await response.json();
    return {
        success: true,
        price: data.price,
        taxRate: data.taxRate
    };
}
```

### 2. Unity端设置

#### 步骤1: 创建Unity项目
1. 创建新的Unity项目(建议使用Unity 2020.3 LTS或更高版本)
2. 将`UnityIntegration.cs`脚本复制到`Assets/Scripts`目录

#### 步骤2: 设置场景
1. 创建一个新的GameObject,命名为`PriceDisplayManager`
2. 将`PriceDisplayManager.cs`脚本附加到该GameObject
3. 创建UI Canvas:
   - 添加Canvas (GameObject > UI > Canvas)
   - 设置Canvas Scaler为Scale With Screen Size
   - 添加TextMeshPro文本用于显示价格

#### 步骤3: 配置脚本参数
在Inspector中配置`PriceDisplayManager`组件:
- **Price Text**: 拖入TextMeshPro文本组件
- **Price Animator**: (可选)拖入Animator组件
- **Animation Duration**: 设置动画持续时间(默认2秒)
- **Animation Curve**: 调整动画曲线
- **Celebration Particles**: (可选)拖入粒子系统
- **Sound Effect**: (可选)拖入AudioSource

#### 步骤4: 构建WebGL
1. File > Build Settings
2. 选择WebGL平台
3. Player Settings:
   - Company Name: 填写你的公司名
   - Product Name: 填写产品名
   - WebGL Template: 选择Minimal或Default
4. 点击Build,选择输出目录为`WebPage/Build`

#### 步骤5: 集成到网页
构建完成后,Unity会生成以下文件:
```
Build/
├── WebGL.loader.js
├── WebGL.data
├── WebGL.framework.js
└── WebGL.wasm
```

确保在`script.js`中正确配置Unity加载路径。

### 3. Unity与JavaScript通信接口

#### JavaScript调用Unity
```javascript
// 发送价格到Unity
unityInstance.SendMessage('PriceDisplayManager', 'SetPrice', '123.45');

// 播放动画
unityInstance.SendMessage('PriceDisplayManager', 'PlayAnimation');

// 重置动画
unityInstance.SendMessage('PriceDisplayManager', 'ResetAnimation');

// 直接设置价格(无动画)
unityInstance.SendMessage('PriceDisplayManager', 'SetPriceDirectly', '123.45');
```

#### Unity调用JavaScript
Unity通过以下回调函数与网页通信:

```javascript
window.UnityCallbacks = {
    // Unity准备就绪
    onUnityReady: function() {
        console.log('Unity已加载');
    },
    
    // 动画播放完成
    onAnimationComplete: function() {
        console.log('动画播放完成');
    },
    
    // Unity错误
    onUnityError: function(error) {
        console.error('Unity错误:', error);
    }
};
```

## Unity动画制作建议

### 基础动画
1. **数字滚动动画** - 已在代码中实现
2. **缩放效果** - 通过Animator添加Scale动画
3. **颜色渐变** - 使用Animation Curve调整颜色

### 高级特效
1. **粒子特效**
   ```csharp
   // 金币飞散效果
   // 烟花爆炸效果
   // 光环扩散效果
   ```

2. **UI动画**
   - DOTween插件实现流畅动画
   - Timeline制作复杂动画序列

3. **音效**
   - 数字滚动音效
   - 完成提示音
   - 背景音乐

### 示例动画流程
```
1. 接收价格数据
2. 触发入场动画(0.5秒)
3. 数字从0滚动到目标价格(2秒)
4. 播放完成特效(1秒)
   - 粒子爆发
   - 音效播放
   - 文字闪烁
5. 通知网页动画完成
```

## 开发和调试

### 调试技巧
1. **摄像头调试**
   - 使用HTTPS或localhost才能访问摄像头
   - 检查浏览器权限设置

2. **Unity调试**
   - 在Unity Editor中测试脚本逻辑
   - 使用Debug.Log查看日志
   - WebGL构建后在浏览器Console查看日志

3. **通信调试**
   ```javascript
   // 添加日志
   console.log('发送到Unity:', data);
   
   // Unity端
   Debug.Log($"收到数据: {data}");
   ```

### 常见问题

**Q: 摄像头无法启动?**
A: 确保使用HTTPS或localhost,并授予浏览器摄像头权限

**Q: Unity无法加载?**
A: 检查Build目录路径,确保所有Unity文件都已正确复制

**Q: JavaScript无法调用Unity?**
A: 确保GameObject名称和方法名完全匹配,检查Unity是否已完全加载

**Q: OCR识别不准确?**
A: 建议使用云端OCR API(百度、阿里云等)以获得更好的识别率

## 扩展功能建议

1. **多语言支持** - 添加i18n国际化
2. **数据库存储** - 将历史记录保存到服务器
3. **用户系统** - 添加登录注册功能
4. **多种税率预设** - 不同国家/地区税率模板
5. **导出功能** - 导出计算结果为PDF/Excel
6. **移动端优化** - 响应式设计和PWA支持

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **WebGL**: Unity (C#)
- **OCR**: Tesseract.js / 云端API
- **存储**: LocalStorage

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

建议使用最新版Chrome以获得最佳性能。

## 许可证

MIT License

## 联系方式

如有问题或建议,请提交Issue或Pull Request。

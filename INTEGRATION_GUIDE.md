# Unity集成完整指南

## ✅ 当前状态

你的Unity项目"StarFalling"已经构建完成，文件位于：
```
f:\WebPage\Unity\Build\
├── Unity.data
├── Unity.framework.js
├── Unity.loader.js
└── Unity.wasm
```

网页已经配置好连接到这些文件！

## 🎯 两种使用方式

### 方式1: 直接使用现有Unity动画（简单）

**当前就可以使用！** 不需要修改Unity项目。

#### 使用步骤：
1. 启动Web服务器：
```bash
cd f:\WebPage
python -m http.server 8000
```

2. 打开浏览器访问：`http://localhost:8000`

3. 操作流程：
   - 输入商品价格（例如：100）
   - 输入税率（例如：13）
   - 点击"计算税价"
   - 点击"进入动画展示"
   - **Unity动画会自动加载并显示**
   - 点击"播放动画"观看你的StarFalling动画

#### 特点：
- ✅ Unity动画正常显示和播放
- ✅ 计算的税价会在网页上显示
- ⚠️ 税价数据不会传入Unity动画中（因为Unity场景中没有接收脚本）
- ⚠️ Unity播放的是原始StarFalling动画

---

### 方式2: Unity动画显示税价数字（高级）

如果你想让Unity动画**显示计算出的税价**，需要修改Unity项目。

#### 步骤1: 在Unity中添加接收脚本

1. 打开你的StarFalling Unity项目
2. 创建新的C#脚本 `PriceDisplayManager.cs`，复制以下代码：

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class PriceDisplayManager : MonoBehaviour
{
    [Header("显示税价的UI")]
    public TextMeshProUGUI priceText;  // 用TextMeshPro显示价格
    // 或者使用: public Text priceText;  // 用普通UI Text显示
    
    [Header("动画设置")]
    public float animationDuration = 2f;
    public AnimationCurve animationCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
    
    private float currentPrice = 0f;
    private float targetPrice = 0f;
    
    void Start()
    {
        if (priceText != null)
        {
            priceText.text = "¥0.00";
        }
        
        Debug.Log("PriceDisplayManager 已准备就绪");
    }
    
    // 网页会调用这个方法发送税价
    public void SetPrice(string price)
    {
        Debug.Log($"收到网页传来的价格: {price}");
        
        if (float.TryParse(price, out float parsedPrice))
        {
            targetPrice = parsedPrice;
            Debug.Log($"设置目标价格: ¥{targetPrice:F2}");
        }
    }
    
    // 网页会调用这个方法播放动画
    public void PlayAnimation()
    {
        Debug.Log($"开始播放价格动画: ¥{targetPrice:F2}");
        StartCoroutine(AnimatePriceCoroutine());
    }
    
    // 价格滚动动画
    private IEnumerator AnimatePriceCoroutine()
    {
        float startPrice = currentPrice;
        float elapsedTime = 0f;
        
        while (elapsedTime < animationDuration)
        {
            elapsedTime += Time.deltaTime;
            float progress = elapsedTime / animationDuration;
            float curvedProgress = animationCurve.Evaluate(progress);
            
            currentPrice = Mathf.Lerp(startPrice, targetPrice, curvedProgress);
            
            if (priceText != null)
            {
                priceText.text = $"¥{currentPrice:F2}";
            }
            
            yield return null;
        }
        
        // 确保最终显示准确价格
        currentPrice = targetPrice;
        if (priceText != null)
        {
            priceText.text = $"¥{currentPrice:F2}";
        }
        
        Debug.Log("价格动画播放完成");
    }
}
```

#### 步骤2: 在Unity场景中设置

1. **创建GameObject**
   - 在Hierarchy中右键 > Create Empty
   - 命名为 `PriceDisplayManager`（名字必须完全一致！）
   - 将 `PriceDisplayManager.cs` 脚本拖到这个GameObject上

2. **创建UI显示价格**
   - 右键 Hierarchy > UI > Canvas
   - 在Canvas下创建 > UI > Text - TextMeshPro（推荐）
     或 UI > Text（普通Text）
   - 命名为 "PriceText"
   - 调整位置、大小、字体、颜色等

3. **连接组件**
   - 选中 `PriceDisplayManager` GameObject
   - 在Inspector中找到 `Price Display Manager` 组件
   - 将 `PriceText` 拖到 `Price Text` 字段

4. **测试（重要！）**
   - 点击Unity的Play按钮
   - 在Console中应该看到："PriceDisplayManager 已准备就绪"
   - 这说明脚本工作正常

#### 步骤3: 重新构建WebGL

1. **File > Build Settings**
2. 确保选择 **WebGL** 平台
3. 点击 **Build**
4. 选择输出目录：`f:\WebPage\Unity\Build`
5. 点击"选择文件夹"开始构建
6. 等待构建完成（会覆盖原有文件）

#### 步骤4: 测试完整流程

1. 重新启动Web服务器（如果之前关闭了）
2. 刷新浏览器页面（Ctrl + F5 强制刷新）
3. 输入价格和税率
4. 进入动画展示
5. **打开浏览器Console（F12）**查看日志
6. 点击"播放动画"

你应该在Console中看到：
```
✅ 数据已发送到Unity - 价格: 113.00
Unity加载进度: 100%
✅ 已发送播放动画指令到Unity
```

在Unity Console中应该看到：
```
收到网页传来的价格: 113.00
设置目标价格: ¥113.00
开始播放价格动画: ¥113.00
价格动画播放完成
```

---

## 🔧 调试技巧

### 检查Unity是否加载
在浏览器Console（F12）中输入：
```javascript
console.log(unityInstance);
```
如果显示对象信息，说明Unity已加载。

### 手动发送数据到Unity
在浏览器Console中输入：
```javascript
unityInstance.SendMessage('PriceDisplayManager', 'SetPrice', '999.99');
unityInstance.SendMessage('PriceDisplayManager', 'PlayAnimation');
```
如果Unity中有PriceDisplayManager，价格会动画显示。

### 查看Unity日志
Unity的Debug.Log会输出到浏览器Console，前缀通常是 `[Unity]`

---

## 🎨 进阶：美化Unity动画

### 1. 添加背景和装饰
- 在Unity中添加你的StarFalling动画背景
- 将价格文字放在合适的位置
- 调整字体、大小、颜色

### 2. 添加特效
```csharp
[Header("特效")]
public ParticleSystem celebrationParticles;
public AudioSource soundEffect;

// 在AnimatePriceCoroutine结束时添加：
if (celebrationParticles != null)
{
    celebrationParticles.Play();
}

if (soundEffect != null)
{
    soundEffect.Play();
}
```

### 3. 多个数字显示
可以显示原价、税率、税价三个数字：
```csharp
public TextMeshProUGUI originalPriceText;
public TextMeshProUGUI taxRateText;
public TextMeshProUGUI finalPriceText;
```

---

## ❓ 常见问题

### Q: Unity加载失败怎么办？
**A:** 检查：
1. 是否使用本地服务器（不能直接打开HTML）
2. Build文件是否完整（4个文件都要有）
3. 浏览器Console中的错误信息

### Q: 数据发送到Unity但没反应？
**A:** 检查：
1. GameObject名称是否为 `PriceDisplayManager`（大小写完全一致）
2. 脚本是否正确挂载到GameObject上
3. Unity Console中是否有错误
4. 是否重新构建了WebGL

### Q: 想同时显示StarFalling动画和价格？
**A:** 可以！在Unity场景中：
1. 保留你的StarFalling动画GameObject
2. 添加新的PriceDisplayManager GameObject
3. 在Canvas上添加价格显示UI
4. 两者可以同时运行

### Q: 不想修改Unity，只想显示原始动画？
**A:** 完全可以！使用"方式1"即可，网页会正常工作，Unity会播放原始动画。

---

## 📊 对比总结

| 功能 | 方式1（当前） | 方式2（集成） |
|-----|------------|------------|
| Unity动画播放 | ✅ | ✅ |
| 网页显示税价 | ✅ | ✅ |
| Unity显示税价 | ❌ | ✅ |
| 需要修改Unity | ❌ | ✅ |
| 数据交互 | ❌ | ✅ |
| 开发难度 | 简单 | 中等 |

---

## 🚀 快速测试

运行这个命令立即测试：
```bash
cd f:\WebPage
python -m http.server 8000
```

然后访问 http://localhost:8000

**现在就可以使用了！** 🎉

// 全局变量
let video = null;
let canvas = null;
let ctx = null;
let stream = null;
let unityInstance = null;
let historyData = [];

// DOM元素
const startCameraBtn = document.getElementById('startCamera');
const captureImageBtn = document.getElementById('captureImage');
const stopCameraBtn = document.getElementById('stopCamera');
const calculateBtn = document.getElementById('calculate');
const nextStepBtn = document.getElementById('nextStep');
const backToInputBtn = document.getElementById('backToInput');
const playAnimationBtn = document.getElementById('playAnimation');
const priceInput = document.getElementById('price');
const taxRateInput = document.getElementById('taxRate');
const taxPriceDisplay = document.getElementById('taxPrice');
const historyBody = document.getElementById('historyBody');

// 步骤控制元素
const step1Content = document.getElementById('step1-content');
const step2Content = document.getElementById('step2-content');
const step1Indicator = document.getElementById('step1-indicator');
const step2Indicator = document.getElementById('step2-indicator');

// 显示信息元素
const displayPrice = document.getElementById('displayPrice');
const displayTaxRate = document.getElementById('displayTaxRate');
const displayTaxPrice = document.getElementById('displayTaxPrice');

// 当前计算的数据
let currentCalculation = {
    price: 0,
    taxRate: 0,
    taxPrice: 0
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    // 绑定事件
    startCameraBtn.addEventListener('click', startCamera);
    captureImageBtn.addEventListener('click', captureImage);
    stopCameraBtn.addEventListener('click', stopCamera);
    calculateBtn.addEventListener('click', calculateTaxPrice);
    nextStepBtn.addEventListener('click', goToStep2);
    backToInputBtn.addEventListener('click', goToStep1);
    playAnimationBtn.addEventListener('click', playUnityAnimation);
    
    // 监听输入变化自动计算
    priceInput.addEventListener('input', autoCalculate);
    taxRateInput.addEventListener('input', autoCalculate);
    
    // 快速预设按钮
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', function() {
            taxRateInput.value = this.dataset.rate;
            autoCalculate();
        });
    });
    
    // 加载历史记录
    loadHistory();
});

// ==================== 摄像头功能 ====================

/**
 * 启动摄像头
 */
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
        
        // 更新按钮状态
        startCameraBtn.disabled = true;
        captureImageBtn.disabled = false;
        stopCameraBtn.disabled = false;
        
        showMessage('摄像头已启动', 'success');
    } catch (error) {
        console.error('启动摄像头失败:', error);
        showMessage('启动摄像头失败: ' + error.message, 'error');
    }
}

/**
 * 停止摄像头
 */
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
        
        // 更新按钮状态
        startCameraBtn.disabled = false;
        captureImageBtn.disabled = true;
        stopCameraBtn.disabled = true;
        
        showMessage('摄像头已停止', 'info');
    }
}

/**
 * 拍照并识别
 */
function captureImage() {
    // 设置canvas尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 绘制当前帧
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // 获取图像数据
    canvas.toBlob(async (blob) => {
        showMessage('正在识别图像...', 'info');
        
        // 调用OCR识别API
        const result = await recognizeImage(blob);
        
        if (result.success) {
            priceInput.value = result.price || '';
            taxRateInput.value = result.taxRate || '';
            calculateTaxPrice();
            showMessage('识别成功!', 'success');
        } else {
            showMessage('识别失败,请手动输入或重试', 'warning');
        }
    }, 'image/jpeg', 0.95);
}

/**
 * 图像识别函数 (调用OCR API)
 * 这里需要集成实际的OCR服务,如Tesseract.js、百度OCR、阿里云OCR等
 */
async function recognizeImage(imageBlob) {
    try {
        // 示例: 使用Tesseract.js进行本地OCR识别
        // 实际项目中可能需要调用云端API获得更好的识别率
        
        // 方案1: 使用Tesseract.js (需要引入库)
        // const { createWorker } = Tesseract;
        // const worker = await createWorker();
        // await worker.loadLanguage('eng');
        // await worker.initialize('eng');
        // const { data: { text } } = await worker.recognize(imageBlob);
        // await worker.terminate();
        
        // 方案2: 调用云端API
        const formData = new FormData();
        formData.append('image', imageBlob);
        
        // 这里需要替换为你的实际API端点
        // const response = await fetch('/api/ocr', {
        //     method: 'POST',
        //     body: formData
        // });
        // const data = await response.json();
        
        // 模拟识别结果 (实际使用时删除此部分)
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockResult = {
            success: true,
            price: (Math.random() * 100 + 10).toFixed(2),
            taxRate: (Math.random() * 20 + 5).toFixed(2)
        };
        
        return mockResult;
        
    } catch (error) {
        console.error('图像识别失败:', error);
        return { success: false };
    }
}

// ==================== 步骤控制功能 ====================

/**
 * 进入第二步
 */
function goToStep2() {
    // 验证数据
    if (!currentCalculation.price || !currentCalculation.taxRate) {
        showMessage('请先计算税价', 'warning');
        return;
    }
    
    // 停止摄像头
    if (stream) {
        stopCamera();
    }
    
    // 切换界面
    step1Content.classList.remove('active');
    step2Content.classList.add('active');
    step1Indicator.classList.remove('active');
    step2Indicator.classList.add('active');
    
    // 更新显示信息
    displayPrice.textContent = `¥${currentCalculation.price.toFixed(2)}`;
    displayTaxRate.textContent = `${currentCalculation.taxRate.toFixed(2)}%`;
    displayTaxPrice.textContent = `¥${currentCalculation.taxPrice.toFixed(2)}`;
    
    // 初始化Unity
    if (!unityInstance) {
        initUnity();
    } else {
        // Unity已加载,直接发送数据 - 传入整数
        sendPriceData(Math.round(currentCalculation.taxPrice));
    }
    
    showMessage('已进入动画展示界面', 'success');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 返回第一步
 */
function goToStep1() {
    // 切换界面
    step2Content.classList.remove('active');
    step1Content.classList.add('active');
    step2Indicator.classList.remove('active');
    step1Indicator.classList.add('active');
    
    showMessage('已返回输入界面', 'info');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 税价计算功能 ====================

/**
 * 自动计算税款
 * 税款 = 商品价格 × 税率
 * 例如: 1000元 × 13% = 130元
 */
function autoCalculate() {
    const price = parseFloat(priceInput.value);
    const taxRate = parseFloat(taxRateInput.value);
    
    if (!isNaN(price) && price > 0 && !isNaN(taxRate) && taxRate >= 0) {
        // 计算税款 = 商品价格 × 税率
        const taxAmount = price * (taxRate / 100);
        taxPriceDisplay.textContent = `¥${taxAmount.toFixed(2)}`;
        
        // 保存当前计算结果（taxPrice 存储的是税款金额）
        currentCalculation = {
            price: price,           // 商品价格
            taxRate: taxRate,       // 税率百分比
            taxPrice: taxAmount     // 税款金额
        };
        
        // 启用下一步按钮
        nextStepBtn.disabled = false;
        
        console.log(`💰 税款计算: ${price}元 × ${taxRate}% = ${taxAmount.toFixed(2)}元`);
    } else {
        taxPriceDisplay.textContent = '¥0.00';
        nextStepBtn.disabled = true;
    }
}

/**
 * 计算税价(按钮点击)
 */
function calculateTaxPrice() {
    autoCalculate();
    
    if (currentCalculation.taxPrice > 0) {
        const price = currentCalculation.price;
        const taxRate = currentCalculation.taxRate;
        const taxAmount = currentCalculation.taxPrice;
        
        showMessage(`税额计算完成! ${price}元 × ${taxRate}% = ${taxAmount.toFixed(2)}元`, 'success');
        
        // 添加动画效果
        taxPriceDisplay.parentElement.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            taxPriceDisplay.parentElement.style.animation = '';
        }, 500);
    } else {
        showMessage('请输入有效的价格和税率', 'warning');
    }
}

// ==================== Unity集成功能 ====================

/**
 * 初始化Unity
 * 连接到你的Unity构建文件
 */
function initUnity() {
    const unityLoading = document.getElementById('unity-loading');
    showMessage('正在加载Unity动画...', 'info');
    
    // Unity配置 - 使用你的Unity/Build目录
    const config = {
        dataUrl: "./Unity/Build/Unity.data",
        frameworkUrl: "./Unity/Build/Unity.framework.js",
        codeUrl: "./Unity/Build/Unity.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "StarFalling",
        productVersion: "0.1.0",
    };

    // Unity loader已经通过script标签加载
    createUnityInstance(document.querySelector("#unity-canvas"), config, (progress) => {
        // 加载进度
        const percentage = Math.round(progress * 100);
        console.log('Unity加载进度:', percentage + '%');
        
        // 更新加载提示
        const loadingText = unityLoading.querySelector('p');
        if (loadingText) {
            loadingText.textContent = `加载Unity动画中... ${percentage}%`;
        }
    }).then((instance) => {
        unityInstance = instance;
        unityLoading.classList.add('hidden');
        playAnimationBtn.disabled = false;
        showMessage('Unity已加载完成!', 'success');
        
        console.log('Unity实例已创建:', unityInstance);
        
        // 自动发送数据到Unity
        if (currentCalculation.taxPrice > 0) {
            setTimeout(() => {
                sendPriceData(currentCalculation.taxPrice.toFixed(2));
            }, 500); // 等待Unity完全初始化
        }
    }).catch((message) => {
        console.error('Unity加载失败:', message);
        unityLoading.innerHTML = `
            <div style="color: #dc3545; text-align: center; padding: 20px;">
                <h3>❌ Unity加载失败</h3>
                <p style="margin: 15px 0;">错误信息: ${message}</p>
                <p style="font-size: 0.9em; opacity: 0.8;">请确保Unity文件完整且路径正确</p>
                <button class="btn btn-primary" onclick="goToStep1()" style="margin-top: 15px;">返回输入界面</button>
            </div>
        `;
        showMessage('Unity加载失败: ' + message, 'error');
    });
}

/**
 * 实际发送价格数据到Unity
 */
function sendPriceData(taxAmount) {
    if (!unityInstance) {
        console.warn('Unity未加载,无法发送数据');
        return;
    }
    
    try {
        // 发送税款到Unity的MasterController
        // taxAmount 就是计算出的税款金额 - 转为整数
        const taxAmountInt = Math.round(parseFloat(taxAmount));
        unityInstance.SendMessage('MasterController', 'SetPrice', taxAmountInt.toString());
        
        playAnimationBtn.disabled = false;
        showMessage('税款数据已发送到Unity!', 'success');
        
        console.log('✅ 税款已发送到Unity:', taxAmount);
        console.log(`计算详情: ${currentCalculation.price}元 × ${currentCalculation.taxRate}% = ${taxAmount}元`);
    } catch (error) {
        console.error('❌ 发送数据到Unity失败:', error);
        showMessage('发送数据失败: ' + error.message, 'error');
        
        // 即使发送失败,也允许播放动画
        playAnimationBtn.disabled = false;
        console.log('⚠️ 虽然发送失败,但仍可播放Unity动画');
    }
}

/**
 * 播放Unity动画
 */
function playUnityAnimation() {
    if (!unityInstance) {
        showMessage('Unity未加载', 'warning');
        return;
    }
    
    try {
        // 添加到历史记录
        addToHistory(
            currentCalculation.price,
            currentCalculation.taxRate,
            currentCalculation.taxPrice
        );
        
        // 再次发送税款数据（确保Unity收到最新数据）- 转为整数
        const taxAmount = currentCalculation.taxPrice;
        const taxAmountInt = Math.round(taxAmount);
        unityInstance.SendMessage('MasterController', 'SetPrice', taxAmountInt.toString());
        console.log('✅ 税款数据已发送（整数）:', taxAmountInt);
        
        // 触发Unity中的动画播放
        unityInstance.SendMessage('MasterController', 'PlayAnimation');
        console.log('✅ 已发送播放动画指令到Unity');
        
        showMessage(`🎬 播放动画: ${currentCalculation.price}元 × ${currentCalculation.taxRate}% = ${taxAmount.toFixed(2)}元`, 'success');
        
        // 禁用播放按钮,防止重复点击
        playAnimationBtn.disabled = true;
        playAnimationBtn.textContent = '⏸️ 播放中...';
        
        setTimeout(() => {
            playAnimationBtn.disabled = false;
            playAnimationBtn.textContent = '▶️ 播放动画';
        }, 3000);
    } catch (error) {
        console.error('播放动画失败:', error);
        showMessage('播放动画失败: ' + error.message, 'error');
    }
}

// ==================== 历史记录功能 ====================

/**
 * 添加到历史记录
 */
function addToHistory(price, taxRate, taxPrice) {
    const record = {
        time: new Date().toLocaleString('zh-CN'),
        price: price.toFixed(2),
        taxRate: taxRate.toFixed(2),
        taxPrice: taxPrice.toFixed(2)
    };
    
    historyData.unshift(record);
    
    // 限制历史记录数量
    if (historyData.length > 10) {
        historyData.pop();
    }
    
    // 保存到本地存储
    localStorage.setItem('priceHistory', JSON.stringify(historyData));
    
    // 更新显示
    renderHistory();
}

/**
 * 加载历史记录
 */
function loadHistory() {
    const saved = localStorage.getItem('priceHistory');
    if (saved) {
        historyData = JSON.parse(saved);
        renderHistory();
    }
}

/**
 * 渲染历史记录
 */
function renderHistory() {
    historyBody.innerHTML = '';
    
    if (historyData.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">暂无历史记录</td></tr>';
        return;
    }
    
    historyData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.time}</td>
            <td>¥${record.price}</td>
            <td>${record.taxRate}%</td>
            <td>¥${record.taxPrice}</td>
            <td><button onclick="replayRecord(${index})">重播</button></td>
        `;
        historyBody.appendChild(row);
    });
}

/**
 * 重播历史记录
 */
function replayRecord(index) {
    const record = historyData[index];
    
    // 返回第一步
    if (!step1Content.classList.contains('active')) {
        goToStep1();
    }
    
    // 填充数据
    priceInput.value = record.price;
    taxRateInput.value = record.taxRate;
    autoCalculate();
    
    showMessage('已加载历史记录', 'info');
    
    // 滚动到输入区域
    setTimeout(() => {
        document.querySelector('.input-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 100);
}

// ==================== 工具函数 ====================

/**
 * 显示消息提示
 */
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // 根据类型设置颜色
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    messageDiv.style.background = colors[type] || colors.info;
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Unity通信接口 ====================

/**
 * 供Unity调用的JavaScript函数
 * Unity可以通过Application.ExternalCall调用这些函数
 */
window.UnityCallbacks = {
    // Unity动画播放完成回调
    onAnimationComplete: function() {
        console.log('Unity动画播放完成');
        showMessage('动画播放完成', 'success');
    },
    
    // Unity初始化完成回调
    onUnityReady: function() {
        console.log('Unity初始化完成');
        playAnimationBtn.disabled = false;
    },
    
    // Unity错误回调
    onUnityError: function(error) {
        console.error('Unity错误:', error);
        showMessage('Unity错误: ' + error, 'error');
    }
};

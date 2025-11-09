// 全局变量
let video = null;
let canvas = null;
let ctx = null;
let stream = null;
let unityInstance = null;
let qrScanningActive = false;
let scanAnimationId = null;

// DOM元素
const qrStatusElement = document.getElementById('qrStatus');
const nextStepBtn = document.getElementById('nextStep');
const backToInputBtn = document.getElementById('backToInput');
const priceInput = document.getElementById('price');
const taxRateInput = document.getElementById('taxRate');
const taxPriceDisplay = document.getElementById('taxPrice');

// 步骤控制元素
const step1Content = document.getElementById('step1-content');
const step2Content = document.getElementById('step2-content');
const step1Indicator = document.getElementById('step1-indicator');
const step2Indicator = document.getElementById('step2-indicator');

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
    nextStepBtn.addEventListener('click', goToStep2);
    backToInputBtn.addEventListener('click', goToStep1);
    
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
    
    // 自动启动二维码扫描
    startQRScanner();
});

// ==================== 二维码扫描功能 ====================

/**
 * 启动二维码扫描器
 */
async function startQRScanner() {
    try {
        // 请求摄像头权限（后置摄像头优先）
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = stream;
        qrScanningActive = true;
        
        // 等待视频加载
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            updateQRStatus('📷 扫描中...', 'scanning');
            requestAnimationFrame(scanQRCode);
        };
        
    } catch (error) {
        console.error('启动摄像头失败:', error);
        updateQRStatus('❌ 摄像头启动失败', 'error');
        showMessage('无法访问摄像头，请检查浏览器权限设置或使用HTTPS', 'error');
    }
}

/**
 * 停止二维码扫描
 */
function stopQRScanner() {
    qrScanningActive = false;
    if (scanAnimationId) {
        cancelAnimationFrame(scanAnimationId);
        scanAnimationId = null;
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
    }
}

/**
 * 扫描二维码
 */
function scanQRCode() {
    if (!qrScanningActive) {
        return;
    }
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        try {
            // 绘制当前视频帧到canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 使用jsQR库解析二维码
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            
            if (code) {
                // 成功扫描到二维码
                handleQRCodeData(code.data);
                return; // 停止扫描
            }
        } catch (error) {
            console.error('二维码扫描错误:', error);
        }
    }
    
    // 继续扫描
    scanAnimationId = requestAnimationFrame(scanQRCode);
}

/**
 * 处理扫描到的二维码数据
 * 二维码格式示例：
 * JSON: {"price": 100, "taxRate": 13}
 * 或 URL参数: price=100&taxRate=13
 */
function handleQRCodeData(qrData) {
    console.log('扫描到二维码:', qrData);
    updateQRStatus('✅ 扫描成功！', 'success');
    
    try {
        let price = null;
        let taxRate = null;
        
        // 尝试解析JSON格式
        try {
            const data = JSON.parse(qrData);
            price = data.price;
            taxRate = data.taxRate || data.tax_rate || data.rate;
        } catch (e) {
            // 尝试解析URL参数格式
            const params = new URLSearchParams(qrData);
            price = params.get('price');
            taxRate = params.get('taxRate') || params.get('tax_rate') || params.get('rate');
        }
        
        if (price !== null && taxRate !== null) {
            // 填充表单
            priceInput.value = price;
            taxRateInput.value = taxRate;
            
            // 自动计算税额
            autoCalculate();
            
            showMessage(`✅ 识别成功！价格: ¥${price}, 税率: ${taxRate}%`, 'success');
            
            // 停止扫描
            stopQRScanner();
            updateQRStatus('✅ 识别完成', 'success');
            
            // 1.5秒后自动进入动画展示
            setTimeout(() => {
                goToStep2();
            }, 1500);
        } else {
            throw new Error('二维码格式错误，缺少price或taxRate字段');
        }
        
    } catch (error) {
        console.error('解析二维码数据失败:', error);
        updateQRStatus('❌ 格式错误，继续扫描...', 'error');
        showMessage('二维码格式错误，请使用正确格式', 'error');
        
        // 继续扫描
        setTimeout(() => {
            updateQRStatus('📷 扫描中...', 'scanning');
            scanAnimationId = requestAnimationFrame(scanQRCode);
        }, 2000);
    }
}

/**
 * 更新二维码扫描状态显示
 */
function updateQRStatus(message, status) {
    if (qrStatusElement) {
        qrStatusElement.textContent = message;
        qrStatusElement.className = 'qr-status-' + status;
    }
}

// ==================== 步骤控制功能 ====================

/**
 * 进入第二步
 */
function goToStep2() {
    // 验证输入
    if (!currentCalculation.price || !currentCalculation.taxRate) {
        showMessage('请先输入价格和税率或扫描二维码！', 'warning');
        return;
    }
    
    // 停止二维码扫描
    stopQRScanner();
    
    // 切换界面
    step1Content.classList.remove('active');
    step2Content.classList.add('active');
    step1Indicator.classList.remove('active');
    step2Indicator.classList.add('active');
    
    // 初始化Unity并自动播放动画
    if (!unityInstance) {
        initUnity();
    } else {
        // Unity已加载，直接播放动画
        playAnimation();
    }
    
    showMessage('正在加载动画...', 'info');
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
    
    // 重新启动二维码扫描
    startQRScanner();
    
    showMessage('已返回输入界面', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== 税款计算功能 ====================

/**
 * 自动计算税款
 * 税款 = 商品价格 × 税率
 */
function autoCalculate() {
    const price = parseFloat(priceInput.value) || 0;
    const taxRate = parseFloat(taxRateInput.value) || 0;
    
    if (price > 0 && taxRate > 0) {
        // 计算税款 = 商品价格 × 税率
        const taxAmount = price * (taxRate / 100);
        taxPriceDisplay.textContent = `¥${taxAmount.toFixed(2)}`;
        
        // 保存当前计算结果（taxPrice 存储的是税款金额）
        currentCalculation = {
            price: price,
            taxRate: taxRate,
            taxPrice: taxAmount     // 税款金额
        };
        
        console.log(`💰 税款计算: ${price}元 × ${taxRate}% = ${taxAmount.toFixed(2)}元`);
    } else {
        taxPriceDisplay.textContent = '¥0.00';
    }
}

// ==================== Unity集成功能 ====================

/**
 * 初始化Unity WebGL
 */
function initUnity() {
    const unityContainer = document.getElementById('unity-container');
    const unityCanvas = document.getElementById('unity-canvas');
    const loadingMessage = document.getElementById('unity-loading');
    const loadingText = document.getElementById('unity-loading-text');
    const progressBar = document.getElementById('unity-progress-bar');
    
    if (typeof createUnityInstance === 'undefined') {
        showMessage('Unity Loader未加载', 'error');
        return;
    }
    
    const config = {
        dataUrl: "./Unity/Build/Unity.data",
        frameworkUrl: "./Unity/Build/Unity.framework.js",
        codeUrl: "./Unity/Build/Unity.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "StarFalling",
        productVersion: "0.1.0",
        // 性能优化配置
        compressedFormat: "br", // 启用Brotli压缩（如果服务器支持）
        matchWebGLToCanvasSize: false, // 不自动匹配canvas大小，提升性能
        devicePixelRatio: 1, // 固定像素比，避免高分辨率设备性能问题
    };
    
    createUnityInstance(unityCanvas, config, (progress) => {
        const percent = Math.round(progress * 100);
        if (loadingText) {
            loadingText.textContent = `加载中... ${percent}%`;
        }
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
        console.log(`Unity加载进度: ${percent}%`);
    }).then((instance) => {
        unityInstance = instance;
        console.log('✅ Unity加载完成');
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
        showMessage('Unity加载完成！', 'success');
        
        // Unity加载完成后自动播放动画
        setTimeout(() => {
            playAnimation();
        }, 500);
        
    }).catch((message) => {
        console.error('❌ Unity加载失败:', message);
        if (loadingMessage) {
            loadingMessage.textContent = '加载失败';
        }
        showMessage('Unity加载失败: ' + message, 'error');
    });
}

/**
 * 播放Unity动画
 */
function playAnimation() {
    if (!unityInstance) {
        showMessage('Unity未加载', 'warning');
        return;
    }
    
    try {
        // 发送税款数据（转为整数）
        const taxAmount = currentCalculation.taxPrice;
        const taxAmountInt = Math.round(taxAmount);
        
        // 发送价格到Unity
        unityInstance.SendMessage('MasterController', 'SetPrice', taxAmountInt.toString());
        console.log('✅ 税款数据已发送:', taxAmountInt);
        
        // 触发动画播放
        unityInstance.SendMessage('MasterController', 'PlayAnimation');
        console.log('✅ 已发送播放动画指令');
        
        showMessage(`🎬 动画播放中: ${currentCalculation.price}元 × ${currentCalculation.taxRate}% = ${taxAmountInt}元`, 'success');
        
    } catch (error) {
        console.error('❌ Unity通信失败:', error);
        showMessage('动画播放失败: ' + error.message, 'error');
    }
}

// ==================== 辅助功能 ====================

/**
 * 显示消息提示
 */
function showMessage(message, type = 'info') {
    // 创建消息元素
    const msgDiv = document.createElement('div');
    msgDiv.className = `message message-${type}`;
    msgDiv.textContent = message;
    
    // 添加到页面
    document.body.appendChild(msgDiv);
    
    // 显示动画
    setTimeout(() => msgDiv.classList.add('show'), 10);
    
    // 3秒后移除
    setTimeout(() => {
        msgDiv.classList.remove('show');
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
    
    console.log(`[${type.toUpperCase()}] ${message}`);
}

using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;
using System.Runtime.InteropServices;

/// <summary>
/// Unity与Web页面通信的管理器
/// 用于接收网页传来的税价数据并控制动画播放
/// </summary>
public class PriceDisplayManager : MonoBehaviour
{
    [Header("UI元素")]
    [Tooltip("显示价格的文本组件")]
    public TextMeshProUGUI priceText;
    
    [Tooltip("价格数字的动画组件")]
    public Animator priceAnimator;
    
    [Header("动画设置")]
    [Tooltip("数字滚动动画持续时间")]
    public float animationDuration = 2f;
    
    [Tooltip("动画曲线")]
    public AnimationCurve animationCurve = AnimationCurve.EaseInOut(0, 0, 1, 1);
    
    [Header("特效")]
    [Tooltip("粒子特效")]
    public ParticleSystem celebrationParticles;
    
    [Tooltip("音效")]
    public AudioSource soundEffect;
    
    private float currentPrice = 0f;
    private float targetPrice = 0f;
    private bool isAnimating = false;
    
    // WebGL与JavaScript通信
    [DllImport("__Internal")]
    private static extern void SendMessageToWeb(string message);
    
    void Start()
    {
        // 初始化
        if (priceText != null)
        {
            priceText.text = "¥0.00";
        }
        
        // 通知网页Unity已准备就绪
        NotifyWebUnityReady();
    }
    
    /// <summary>
    /// 从网页接收价格数据
    /// 这个方法会被JavaScript调用: unityInstance.SendMessage('PriceDisplayManager', 'SetPrice', value)
    /// </summary>
    /// <param name="price">税价</param>
    public void SetPrice(string price)
    {
        Debug.Log($"收到网页传来的价格: {price}");
        
        if (float.TryParse(price, out float parsedPrice))
        {
            targetPrice = parsedPrice;
            Debug.Log($"设置目标价格: ¥{targetPrice:F2}");
        }
        else
        {
            Debug.LogError($"价格解析失败: {price}");
        }
    }
    
    /// <summary>
    /// 播放价格显示动画
    /// 这个方法会被JavaScript调用: unityInstance.SendMessage('PriceDisplayManager', 'PlayAnimation')
    /// </summary>
    public void PlayAnimation()
    {
        if (isAnimating)
        {
            Debug.LogWarning("动画正在播放中");
            return;
        }
        
        Debug.Log($"开始播放价格动画: ¥{targetPrice:F2}");
        StartCoroutine(AnimatePriceCoroutine());
    }
    
    /// <summary>
    /// 价格滚动动画协程
    /// </summary>
    private IEnumerator AnimatePriceCoroutine()
    {
        isAnimating = true;
        float startPrice = currentPrice;
        float elapsedTime = 0f;
        
        // 触发Animator动画(如果有)
        if (priceAnimator != null)
        {
            priceAnimator.SetTrigger("Show");
        }
        
        // 数字滚动动画
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
        
        // 确保最终显示准确的目标价格
        currentPrice = targetPrice;
        if (priceText != null)
        {
            priceText.text = $"¥{currentPrice:F2}";
        }
        
        // 播放庆祝特效
        if (celebrationParticles != null)
        {
            celebrationParticles.Play();
        }
        
        // 播放音效
        if (soundEffect != null)
        {
            soundEffect.Play();
        }
        
        isAnimating = false;
        
        // 通知网页动画完成
        NotifyWebAnimationComplete();
        
        Debug.Log("价格动画播放完成");
    }
    
    /// <summary>
    /// 重置动画
    /// </summary>
    public void ResetAnimation()
    {
        StopAllCoroutines();
        currentPrice = 0f;
        targetPrice = 0f;
        isAnimating = false;
        
        if (priceText != null)
        {
            priceText.text = "¥0.00";
        }
        
        if (priceAnimator != null)
        {
            priceAnimator.SetTrigger("Reset");
        }
        
        Debug.Log("动画已重置");
    }
    
    /// <summary>
    /// 直接设置价格(无动画)
    /// </summary>
    public void SetPriceDirectly(string price)
    {
        if (float.TryParse(price, out float parsedPrice))
        {
            currentPrice = parsedPrice;
            targetPrice = parsedPrice;
            
            if (priceText != null)
            {
                priceText.text = $"¥{currentPrice:F2}";
            }
        }
    }
    
    /// <summary>
    /// 通知网页Unity已准备就绪
    /// </summary>
    private void NotifyWebUnityReady()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        try
        {
            SendMessageToWeb("UnityCallbacks.onUnityReady()");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"通知网页失败: {e.Message}");
        }
#else
        Debug.Log("Unity已准备就绪(非WebGL环境)");
#endif
    }
    
    /// <summary>
    /// 通知网页动画播放完成
    /// </summary>
    private void NotifyWebAnimationComplete()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        try
        {
            SendMessageToWeb("UnityCallbacks.onAnimationComplete()");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"通知网页失败: {e.Message}");
        }
#else
        Debug.Log("动画播放完成(非WebGL环境)");
#endif
    }
    
    /// <summary>
    /// 通知网页发生错误
    /// </summary>
    private void NotifyWebError(string error)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        try
        {
            SendMessageToWeb($"UnityCallbacks.onUnityError('{error}')");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"通知网页错误失败: {e.Message}");
        }
#endif
    }
}

/// <summary>
/// 数字滚动特效组件
/// 可以添加额外的视觉效果
/// </summary>
public class NumberScrollEffect : MonoBehaviour
{
    [Header("滚动设置")]
    public float scrollSpeed = 100f;
    public Color highlightColor = Color.yellow;
    public Color normalColor = Color.white;
    
    private TextMeshProUGUI text;
    private Vector3 originalScale;
    
    void Awake()
    {
        text = GetComponent<TextMeshProUGUI>();
        originalScale = transform.localScale;
    }
    
    /// <summary>
    /// 播放高亮效果
    /// </summary>
    public void PlayHighlight()
    {
        StartCoroutine(HighlightCoroutine());
    }
    
    private IEnumerator HighlightCoroutine()
    {
        // 放大
        float duration = 0.3f;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float progress = elapsed / duration;
            
            transform.localScale = Vector3.Lerp(originalScale, originalScale * 1.2f, progress);
            text.color = Color.Lerp(normalColor, highlightColor, progress);
            
            yield return null;
        }
        
        // 恢复
        elapsed = 0f;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float progress = elapsed / duration;
            
            transform.localScale = Vector3.Lerp(originalScale * 1.2f, originalScale, progress);
            text.color = Color.Lerp(highlightColor, normalColor, progress);
            
            yield return null;
        }
        
        transform.localScale = originalScale;
        text.color = normalColor;
    }
}

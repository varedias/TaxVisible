using UnityEngine;
using TMPro; // 如果使用TextMeshPro

public class MasterController : MonoBehaviour
{
    // 引用你的TextMeshPro文字组件
    public TextMeshProUGUI priceText;
    
    // 接收从网页传来的价格数据
    public void SetPrice(string price)
    {
        Debug.Log("收到价格数据: " + price);
        
        // ⚠️ 重要：只显示 ￥ + 数字，不要添加其他文字！
        // 正确做法：
        priceText.text = "￥" + price;
        
        // ❌ 错误做法（会显示多余文字）：
        // priceText.text = "税额: ￥" + price;  // 这样会显示 "税额: ￥100"
        // priceText.text = "税款￥" + price;    // 这样会显示 "税款￥100"
    }
    
    // 播放动画
    public void PlayAnimation()
    {
        Debug.Log("开始播放动画");
        
        // 在这里触发你的动画
        // 例如：
        // GetComponent<Animator>().SetTrigger("Play");
        // 或者播放粒子特效、移动物体等
    }
}

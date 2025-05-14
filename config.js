// 获取配置并处理
async function fetchConfig() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/bemol55555/DurianFortune/main/home.json', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // 先打印原始响应
        const rawText = await response.text();
        console.log('接口原始响应:', rawText);
        
        // 尝试解析 JSON
        const data = JSON.parse(rawText);
        
        // 检查返回码
        if (data.code !== 200) {
            throw new Error('接口返回错误码: ' + data.code);
        }
        
        // 获取配置参数
        const key = data.DurianFortune_key;
        const ent = data.DurianFortune_ent;
        const tz = data.DurianFortune_tz;
        const url = data.DurianFortune_ur;

        // 如果需要跳转
        if (url) {
            console.log('准备跳转到：', url);
            // 使用广播方式
            if (window.android && window.android.sendBroadcast) {
                console.log('发送广播，参数：', {
                    url: url,
                    key: key,
                    ent: ent,
                    tz: tz
                });
                window.android.sendBroadcast('com.durian.fortune.REDIRECT', JSON.stringify({
                    url: url,
                    key: key,
                    ent: ent,
                    tz: tz
                }));
            } else {
                console.error('Android 接口未找到');
            }
        } else {
            // 如果没有跳转URL，显示主界面
            console.log('没有跳转URL，显示主界面');
            document.getElementById('splashScreen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }
    } catch (error) {
        console.error('获取配置失败:', error);
        console.error('错误详情:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        // 发生错误时也显示主界面
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }
}

// 立即执行
fetchConfig();

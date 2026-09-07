# 果汁大作战 / Fruit Motion

独立静态网页：`fruit-motion.html`。双手摄像头体感切水果，也支持按住鼠标拖动和触屏划动。60 秒一局，无炸弹，漏掉水果不扣分。

## 本地运行

在仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

打开 http://localhost:8765/fruit-motion.html 。不要直接双击 HTML：摄像头和模块加载需要 localhost 或 HTTPS。

点击「开启摄像头」，允许浏览器访问摄像头。让肩膀、手肘和双手进入画面；看到跟随手腕的光点后，点击「开始挑战」。左右手都能切水果。摄像头权限被拒绝时，可在浏览器地址栏重新允许，或选择鼠标试玩。

所有运行文件和模型都在仓库内，本地运行不需要 CDN、API 密钥、构建步骤或云端推理。仅请求视频，不请求麦克风；不录制、不上传画面。最高分保存在此浏览器的 localStorage 中。

## 网站

随现有 GitHub Pages 网站发布，路径为 `/fruit-motion.html`。摄像头必须通过 HTTPS 使用。建议电脑 Chrome / Edge；不支持姿态识别所需浏览器能力时可使用鼠标模式。

## 结构与维护

- `assets/js/fruit-game-core.js`：水果物理、计分、连续线段碰撞、镜像坐标和挥动过滤。
- `assets/js/fruit-motion.js`：画布、声音、输入、摄像头权限、计时和界面状态。
- `assets/js/fruit-pose-worker.js`：在经典 Web Worker 中运行姿态识别，主线程负责动画。使用 CPU 委托，避免要求设备提供 WebGPU。
- `assets/vendor/mediapipe/`：固定版本运行时、SIMD / 非 SIMD WASM、轻量姿态模型及许可证。

摄像头识别暂停或失去双手超过 3 秒时自动暂停游戏。切换标签页也会暂停。关闭摄像头、切到鼠标模式、离开页面时停止视频轨道并终止识别线程。

双手识别效果与光线、遮挡、摄像头视角及电脑性能有关；优先让上半身和双手完整进入画面。静态照片测试不能代替真实使用摄像头挥动双臂的验收。

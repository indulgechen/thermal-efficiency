# 热机 · three.js（Blender GLB）版

和冰箱同一套流程：Blender 脚本建模 → 导出 GLB → three.js 渲染，页面沿用原来的教材排版。

> 双击 `热机-3D-threejs.html` 打开。需要 WebGL（Chrome / Edge / Firefox）。
> 单文件 **1.62 MB**（three.js 740 KB + GLB 899 KB base64 + 界面），离线可用。

![热机 three.js 版](preview-engine-threejs.png)

---

## 3D 里有什么

| 部件 | 做法 |
| --- | --- |
| 锅炉 | 圆筒 + 加固环 + 水位计（玻璃条 + 水位）；炉膛里烧柴火：三根木柴（年轮断面 + 炭化斑）+ 炭火层 + 程序化火焰精灵 |
| 汽缸 | **剖切筒身**（切掉前面约 110°）＋ 两端法兰，能看到里面的活塞 |
| 活塞 / 连杆 / 飞轮 | 三个独立节点，JS 每帧按曲柄滑块公式驱动 |
| 蒸汽管 | 铜管，锅炉顶 → 汽缸左侧，**沿长度切开约 90°**，能看到管内 |
| 排气管 | 从汽缸**同侧**下口出 → 顶部横管 → 冷凝器，同样半截面 |
| 冷凝器 | 蛇形盘管 + 散热片，盘管半截面 |
| 凝结水管 / 泵 | 底部回锅炉，带一个小泵，半截面 |

> 管路都是「半截面」：切开朝向镜头的一侧（约 90°），用 Solidify 补上壁厚。
> 粒子半径压到 0.021，正好在管内流动，像气泡/汽柱，而不是贴在管外。

动画：
- **活塞**：`x = pin.x − √(L² − Δz²)`，曲柄滑块精确解，连杆长度不变
- **连杆**：每帧用 `setFromUnitVectors` 指向曲柄销，`scale.x = 长度`
- **飞轮**：绕自身 Y 轴转 θ
- **粒子**：吸热时白汽沿蒸汽管、排气时灰汽沿排气管、凝结时蓝水滴沿回水管

## 互动

- 拖拽旋转、滚轮缩放（OrbitControls）
- 点 ①②③④：锅炉 / 汽缸 / 冷凝器 / 飞轮 的卡片
- 底部 01–04：吸热产汽 → 膨胀做功 → 排气冷凝 → 凝结回流
- 拖动「锅炉 T₁」：η = 1 − 300/T₁ 实时变化，W、Q₂ 重新分配
- `空格` 暂停、`F` 全屏、`R` 重置视角

## 重新生成

```bash
# 1) Blender 重建并导出 GLB（Z-up）
"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P blender\engine_proto.py

# 2) 打包单文件
node build-glb-engine.js
```

- `dev-glb-engine/` 是拆分版（index.html / styles.css / app.js / engine.glb / vendor）
- GLB 用 `export_yup=False` 导出，three.js 里 `model.rotation.x = -Math.PI/2` 立起来；
  这样活塞、连杆的坐标可以直接用 Blender 坐标算，不用做轴变换
- 换模型：替换 `engine.glb`，保持节点名 `piston` / `rod` / `flywheel`

### URL 参数
- `?still=1` 跳过入场淡入（截图用）
- `?static=1` 只渲染一帧（调试用；注意单帧后画布可能被清空）

---

## 和 Canvas 版对比

| | Canvas 版 | three.js 版 |
| --- | --- | --- |
| 体积 | 56 KB | 1.62 MB |
| 视角 | 固定轨道 | 自由旋转/缩放 |
| 汽缸 | 线框笼子 | 剖切金属筒 + 活塞 |
| 光影 | 手绘渐变 | 真实 PBR + 软阴影 |

**已知不足**：冷凝器被飞轮挡住一部分；炉火只是发光条，没有火焰形态；管件接头、铭牌、贴图都还没做。要更精致的话，下一步是加法兰/卡箍、把冷凝器挪到飞轮右后方、火焰用面片 + 噪声贴图。

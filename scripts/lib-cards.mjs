// 168 張原創高對比黑白卡圖案（14 主題 × 12 張）
import {
  K, circle, ellipse, rect, line, path, poly, g, dot,
  starPoints, toPath, sinePath, spiralPath, arcPath, ring, ngon, blobPath, smile, eye, eyeOpen, eyeClosed,
} from './lib-draw.mjs';

const C = 512; // 畫布中心

/* ------------------------------------------------------------------ 幾何圖形 */
const geometric = [
  { title: '大圓點', draw: () => circle(C, C, 360, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '靶心', draw: () => circle(C, C, 380, { fill: K, sw: 0, stroke: 'none' }) + circle(C, C, 240, { fill: '#fff', sw: 0, stroke: 'none' }) + circle(C, C, 120, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '同心圓', draw: () => circle(C, C, 380, { sw: 36 }) + circle(C, C, 250, { sw: 36 }) + circle(C, C, 120, { sw: 36 }) },
  { title: '圓框方心', draw: () => circle(C, C, 370, { sw: 34 }) + rect(330, 330, 364, 364, { sw: 34 }) },
  { title: '大三角形', draw: () => poly([[C, 160], [860, 830], [164, 830]], { sw: 38 }) },
  { title: '星形', draw: () => poly(starPoints(C, C, 390, 165, 5), { fill: K, sw: 0, stroke: 'none' }) },
  { title: '菱形', draw: () => poly([[C, 150], [870, C], [C, 874], [154, C]], { sw: 36 }) + poly([[C, 330], [694, C], [C, 694], [330, C]], { sw: 30 }) },
  { title: '棋盤格', draw: () => {
      let s = '';
      const cell = 160, o = C - 2 * cell / 2;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) s += rect(o + i * cell, o + j * cell, cell, cell, { fill: K, sw: 0, stroke: 'none' });
      }
      return rect(o - 12, o - 12, 4 * cell + 24, 4 * cell + 24, { sw: 28 }) + s;
    } },
  { title: '橫條紋', draw: () => {
      let s = '';
      for (let i = 0; i < 7; i++) s += line(180, 220 + i * 97, 844, 220 + i * 97, { sw: 44 });
      return s;
    } },
  { title: '斜條紋', draw: () => {
      let s = '';
      for (let i = 0; i < 4; i++) s += line(120 + i * 170, 894, 490 + i * 170, 130, { sw: 40 });
      return s;
    } },
  { title: '波浪線', draw: () => path(sinePath(120, 904, C, 210, 2), { sw: 40 }) + path(sinePath(120, 904, C - 240, 120, 2), { sw: 30 }) },
  { title: '交叉線', draw: () => line(220, 220, 804, 804, { sw: 40 }) + line(804, 220, 220, 804, { sw: 40 }) + line(512, 150, 512, 874, { sw: 40 }) + line(150, 512, 874, 512, { sw: 40 }) },
];

/* ------------------------------------------------------------------ 追視線條 */
const tracking = [
  { title: '慢速螺旋', draw: () => path(spiralPath(C, C, 30, 430, 3.2), { sw: 26 }) },
  { title: '蛇行曲線', draw: () => path(sinePath(110, 914, C, 250, 2.5), { sw: 34 }) },
  { title: '圓形軌道', draw: () => path(arcPath(C, C, 350, -60, 250), { sw: 40 }) + poly([[C + 350 * Math.cos(-60 * Math.PI / 180), C + 350 * Math.sin(-60 * Math.PI / 180)], [760, 150], [640, 260]], { fill: K, sw: 0, stroke: 'none' }) },
  { title: '雷達掃描', draw: () => path(arcPath(C, C, 390, 180, 360), { sw: 28 }) + path(arcPath(C, C, 280, 180, 360), { sw: 28 }) + path(arcPath(C, C, 170, 180, 360), { sw: 28 }) + line(C, C, C + 330 * Math.cos(-45 * Math.PI / 180), C + 330 * Math.sin(-45 * Math.PI / 180), { sw: 34 }) },
  { title: '之字形', draw: () => {
      let d = 'M 160 760';
      for (let i = 0; i < 4; i++) d += ` L ${160 + i * 175} 280 L ${330 + i * 175} 760`;
      return path(d, { sw: 34 });
    } },
  { title: '階梯線', draw: () => {
      let d = 'M 130 820';
      for (let i = 0; i < 5; i++) d += ` L ${130 + i * 150} ${820 - i * 140} L ${280 + i * 150} ${820 - i * 140}`;
      return path(d, { sw: 34 });
    } },
  { title: '橫向 S 曲線', draw: () => path(sinePath(110, 914, C, 190, 1.2), { sw: 38 }) + line(110, 190, 914, 190, { sw: 24 }) },
  { title: '對角弧線', draw: () => path(arcPath(300, 300, 480, 0, 90), { sw: 38 }) + path(arcPath(724, 724, 480, 180, 270), { sw: 38 }) },
  { title: '橢圓軌道', draw: () => ellipse(C, C, 400, 250, { sw: 38 }) + circle(C + 400, C, 34, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '雙頻道', draw: () => path(sinePath(110, 914, C - 130, 140, 2), { sw: 30 }) + path(sinePath(110, 914, C + 130, 140, 2), { sw: 30 }) },
  { title: '放射螺旋', draw: () => path(spiralPath(C, C, 60, 400, 2), { sw: 26 }) + ring(C, C, 430, 8).map((p) => line(C, C, p[0], p[1], { sw: 22 })).join('') },
  { title: '編織格紋', draw: () => {
      let s = '';
      for (let i = 0; i < 4; i++) s += line(200 + i * 208, 140, 200 + i * 208, 884, { sw: 28 });
      for (let i = 0; i < 4; i++) s += line(140, 200 + i * 208, 884, 200 + i * 208, { sw: 28 });
      return s;
    } },
];

/* ------------------------------------------------------------------ 動物輪廓 */
const animal = [
  { title: '熊貓', draw: () =>
      circle(300, 290, 110, { sw: 30 }) + circle(724, 290, 110, { sw: 30 }) +
      circle(C, 520, 300, { fill: '#fff', sw: 32 }) +
      ellipse(398, 470, 92, 112, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(626, 470, 92, 112, { fill: K, sw: 0, stroke: 'none' }) +
      circle(398, 470, 40, { fill: '#fff', sw: 22 }) + dot(398, 470, 18) +
      circle(626, 470, 40, { fill: '#fff', sw: 22 }) + dot(626, 470, 18) +
      ellipse(C, 596, 58, 42, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 638 L 512 678 M 512 678 Q 452 716 412 676 M 512 678 Q 572 716 612 676', { sw: 24 }) },
  { title: '小貓', draw: () =>
      poly([[288, 350], [318, 150], [462, 268]], { sw: 30 }) +
      poly([[736, 350], [706, 150], [562, 268]], { sw: 30 }) +
      circle(C, 560, 280, { fill: '#fff', sw: 32 }) +
      poly([[320, 320], [336, 214], [412, 288]], { fill: '#fff', sw: 16 }) +
      poly([[704, 320], [688, 214], [612, 288]], { fill: '#fff', sw: 16 }) +
      ellipse(404, 536, 50, 66, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(620, 536, 50, 66, { fill: K, sw: 0, stroke: 'none' }) +
      poly([[512, 620], [556, 654], [468, 654]], { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 654 L 512 686 M 512 686 Q 466 720 432 686 M 512 686 Q 558 720 592 686', { sw: 22 }) +
      line(300, 640, 176, 610, { sw: 20 }) + line(300, 686, 184, 700, { sw: 20 }) +
      line(724, 640, 848, 610, { sw: 20 }) + line(724, 686, 840, 700, { sw: 20 }) },
  { title: '小狗', draw: () =>
      g(ellipse(276, 520, 96, 200, { sw: 30 }), { transform: 'rotate(-14 276 520)' }) +
      g(ellipse(748, 520, 96, 200, { sw: 30 }), { transform: 'rotate(14 748 520)' }) +
      circle(C, 520, 280, { fill: '#fff', sw: 32 }) +
      ellipse(410, 470, 42, 50, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(614, 470, 42, 50, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(C, 650, 150, 108, { fill: '#fff', sw: 30 }) +
      ellipse(C, 608, 58, 44, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 660 L 512 700 M 512 700 Q 464 736 428 700 M 512 700 Q 560 736 596 700', { sw: 22 }) },
  { title: '小熊', draw: () =>
      circle(300, 300, 96, { sw: 30 }) + circle(724, 300, 96, { sw: 30 }) +
      circle(C, 540, 290, { fill: '#fff', sw: 32 }) +
      ellipse(C, 632, 130, 100, { fill: '#fff', sw: 28 }) +
      ellipse(C, 590, 52, 38, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 628 L 512 668 M 512 668 Q 466 702 430 668 M 512 668 Q 558 702 594 668', { sw: 22 }) +
      eye(410, 500, 34) + eye(614, 500, 34) },
  { title: '企鵝', draw: () =>
      g(ellipse(258, 640, 62, 160, { sw: 24 }), { transform: 'rotate(14 258 640)' }) +
      g(ellipse(766, 640, 62, 160, { sw: 24 }), { transform: 'rotate(-14 766 640)' }) +
      poly([[404, 880], [500, 880], [452, 946]], { fill: K, sw: 0, stroke: 'none' }) +
      poly([[524, 880], [620, 880], [572, 946]], { fill: K, sw: 0, stroke: 'none' }) +
      circle(C, 330, 155, { fill: '#fff', sw: 32 }) +
      ellipse(C, 650, 235, 250, { fill: '#fff', sw: 32 }) +
      ellipse(C, 690, 150, 190, { fill: '#fff', sw: 26 }) +
      ellipse(466, 300, 34, 40, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(558, 300, 34, 40, { fill: K, sw: 0, stroke: 'none' }) +
      poly([[512, 380], [572, 424], [512, 468], [452, 424]], { fill: K, sw: 0, stroke: 'none' }) },
  { title: '小魚', draw: () =>
      poly([[700, C], [880, 400], [880, 624]], { sw: 30 }) +
      poly([[440, 366], [500, 250], [580, 380]], { sw: 26 }) +
      poly([[420, 660], [500, 760], [566, 646]], { sw: 26 }) +
      ellipse(460, C, 260, 170, { fill: '#fff', sw: 32 }) +
      circle(320, 470, 42, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 250 560 Q 340 620 430 590', { sw: 22 }) },
  { title: '小鳥', draw: () =>
      ellipse(470, 590, 120, 80, { sw: 26 }) +
      line(500, 770, 500, 870, { sw: 24 }) + line(560, 770, 560, 870, { sw: 24 }) +
      line(480, 870, 520, 870, { sw: 22 }) + line(540, 870, 580, 870, { sw: 22 }) +
      circle(500, 360, 150, { fill: '#fff', sw: 32 }) +
      ellipse(520, 590, 220, 190, { fill: '#fff', sw: 32 }) +
      poly([[640, 360], [790, 400], [640, 440]], { sw: 26 }) +
      circle(548, 330, 38, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '兔子', draw: () =>
      g(ellipse(430, 250, 78, 190, { sw: 30 }), { transform: 'rotate(-10 430 250)' }) +
      g(ellipse(594, 250, 78, 190, { sw: 30 }), { transform: 'rotate(10 594 250)' }) +
      circle(C, 610, 250, { fill: '#fff', sw: 32 }) +
      ellipse(410, 570, 46, 58, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(614, 570, 46, 58, { fill: K, sw: 0, stroke: 'none' }) +
      poly([[512, 660], [548, 690], [476, 690]], { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 690 L 512 716 M 512 716 Q 474 746 444 716 M 512 716 Q 550 746 580 716', { sw: 20 }) +
      line(320, 690, 220, 668, { sw: 18 }) + line(320, 726, 226, 734, { sw: 18 }) +
      line(704, 690, 804, 668, { sw: 18 }) + line(704, 726, 798, 734, { sw: 18 }) },
  { title: '烏龜', draw: () =>
      rect(300, 700, 120, 80, { rx: 34, sw: 26 }) + rect(620, 700, 120, 80, { rx: 34, sw: 26 }) +
      circle(790, 540, 96, { fill: '#fff', sw: 30 }) +
      ellipse(C, 540, 280, 210, { fill: '#fff', sw: 32 }) +
      poly([[512, 360], [660, 540], [512, 720], [364, 540]], { sw: 24 }) +
      ellipse(816, 528, 22, 26, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '長頸鹿', draw: () =>
      rect(456, 300, 112, 470, { sw: 26 }) +
      circle(496, 430, 28, { fill: K, sw: 0, stroke: 'none' }) +
      circle(534, 540, 24, { fill: K, sw: 0, stroke: 'none' }) +
      circle(494, 660, 24, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(348, 262, 58, 32, { sw: 22 }) + ellipse(676, 262, 58, 32, { sw: 22 }) +
      line(472, 156, 472, 76, { sw: 20 }) + circle(472, 60, 20, { fill: K, sw: 0, stroke: 'none' }) +
      line(552, 156, 552, 76, { sw: 20 }) + circle(552, 60, 20, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(C, 250, 172, 108, { fill: '#fff', sw: 28 }) +
      eye(458, 238, 24) + eye(566, 238, 24) +
      ellipse(C, 306, 62, 40, { fill: '#fff', sw: 22 }) +
      circle(490, 300, 11, { fill: K, sw: 0, stroke: 'none' }) + circle(534, 300, 11, { fill: K, sw: 0, stroke: 'none' }) },  { title: '猴子', draw: () =>
      circle(258, 520, 96, { sw: 30 }) + circle(766, 520, 96, { sw: 30 }) +
      circle(C, 500, 270, { fill: '#fff', sw: 32 }) +
      ellipse(C, 560, 190, 180, { fill: '#fff', sw: 28 }) +
      ellipse(430, 500, 42, 52, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(594, 500, 42, 52, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(C, 648, 118, 88, { fill: '#fff', sw: 26 }) +
      ellipse(478, 640, 20, 26, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(546, 640, 20, 26, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 470 700 Q 512 736 554 700', { sw: 22 }) },
  { title: '老虎', draw: () =>
      circle(296, 300, 92, { sw: 30 }) + circle(728, 300, 92, { sw: 30 }) +
      circle(C, 540, 290, { fill: '#fff', sw: 32 }) +
      line(430, 300, 452, 380, { sw: 24 }) + line(512, 286, 512, 372, { sw: 24 }) + line(594, 300, 572, 380, { sw: 24 }) +
      line(300, 460, 350, 500, { sw: 22 }) + line(250, 560, 320, 572, { sw: 22 }) +
      line(724, 460, 674, 500, { sw: 22 }) + line(774, 560, 704, 572, { sw: 22 }) +
      ellipse(410, 500, 46, 54, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(614, 500, 46, 54, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(C, 630, 120, 82, { fill: '#fff', sw: 26 }) +
      poly([[512, 604], [552, 634], [472, 634]], { fill: K, sw: 0, stroke: 'none' }) +
      path('M 512 634 L 512 664 M 512 664 Q 470 696 436 664 M 512 664 Q 554 696 588 664', { sw: 22 }) },
];

/* ------------------------------------------------------------------ 表情臉孔 */
const face = [
  { title: '微笑臉', draw: () => circle(C, C, 340, { sw: 34 }) + eye(410, 460, 44) + eye(614, 460, 44) + smile(C, 540, 120, 32) },
  { title: '大眼睛', draw: () => circle(C, C, 340, { sw: 34 }) + eyeOpen(410, 460, 78) + eyeOpen(614, 460, 78) + path('M 330 350 L 470 320', { sw: 26 }) + path('M 694 350 L 554 320', { sw: 26 }) },
  { title: '平靜臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeClosed(410, 470, 62) + eyeClosed(614, 470, 62) + path('M 452 620 Q 512 660 572 620', { sw: 28 }) },
  { title: '眨眼', draw: () => circle(C, C, 340, { sw: 34 }) + eye(410, 470, 44) + eyeClosed(614, 470, 62) + smile(C, 570, 110, 30) },
  { title: '吃驚臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeOpen(408, 430, 66) + eyeOpen(616, 430, 66) + ellipse(C, 640, 78, 96, { sw: 28 }) },
  { title: '大笑臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeClosed(410, 440, 64) + eyeClosed(614, 440, 64) + path('M 340 560 A 190 190 0 0 0 684 560 Z', { fill: K, sw: 28 }) },
  { title: '睡臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeClosed(410, 480, 62) + eyeClosed(614, 480, 62) + ellipse(C, 640, 46, 56, { sw: 26 }) + path('M 740 300 q 40 -46 0 -92 q -40 -46 0 -92', { sw: 22 }) },
  { title: '好奇臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeOpen(430, 470, 62) + eyeOpen(610, 470, 62) + path('M 350 360 Q 420 320 500 340', { sw: 26 }) + ellipse(C, 640, 54, 42, { sw: 26 }) },
  { title: '俏皮臉', draw: () => circle(C, C, 340, { sw: 34 }) + eye(410, 470, 44) + eyeClosed(614, 470, 62) + smile(C, 580, 110, 30) + path('M 452 636 Q 512 720 572 636 Q 512 690 452 636 Z', { fill: K, sw: 0, stroke: 'none' }) },
  { title: '親親臉', draw: () => circle(C, C, 340, { sw: 34 }) + eyeClosed(408, 470, 62) + eyeClosed(616, 470, 62) + path('M 420 620 Q 512 566 604 620 Q 512 700 420 620 Z', { sw: 28 }) },
  { title: '皺眉臉', draw: () => circle(C, C, 340, { sw: 34 }) + path('M 340 380 L 470 420', { sw: 28 }) + path('M 684 380 L 554 420', { sw: 28 }) + eye(410, 490, 42) + eye(614, 490, 42) + path('M 440 660 Q 512 606 584 660', { sw: 28 }) },
  { title: '直視臉', draw: () => circle(C, C, 340, { sw: 34 }) + circle(410, 470, 92, { sw: 30 }) + circle(614, 470, 92, { sw: 30 }) + dot(410, 470, 38) + dot(614, 470, 38) + line(452, 640, 572, 640, { sw: 28 }) },
];

/* ------------------------------------------------------------------ 生活用品 */
const object = [
  { title: '奶瓶', draw: () =>
      path('M 452 200 L 572 200 L 572 300 L 452 300 Z', { sw: 26 }) +
      path('M 480 120 Q 512 84 544 120 L 544 200 L 480 200 Z', { sw: 26 }) +
      rect(430, 300, 164, 60, { sw: 26 }) +
      path('M 436 360 L 588 360 L 588 800 Q 588 850 538 850 L 486 850 Q 436 850 436 800 Z', { sw: 30 }) +
      line(470, 560, 554, 560, { sw: 24 }) + line(470, 660, 554, 660, { sw: 24 }) },
  { title: '水杯', draw: () =>
      path('M 360 340 L 664 340 L 620 830 L 404 830 Z', { sw: 30 }) +
      path('M 664 460 Q 790 470 770 600 Q 750 700 636 690', { sw: 30 }) +
      path('M 440 210 Q 470 160 440 110', { sw: 20 }) + path('M 512 200 Q 542 150 512 100', { sw: 20 }) + path('M 584 210 Q 614 160 584 110', { sw: 20 }) },
  { title: '湯匙', draw: () =>
      rect(468, 540, 88, 380, { rx: 30, sw: 30 }) +
      ellipse(512, 330, 190, 240, { fill: '#fff', sw: 30 }) },
  { title: '搖鈴', draw: () =>
      rect(470, 670, 84, 230, { rx: 40, sw: 28 }) +
      circle(512, 430, 250, { fill: '#fff', sw: 32 }) +
      circle(512, 430, 120, { sw: 26 }) +
      circle(512, 430, 44, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '積木', draw: () =>
      rect(180, 560, 300, 300, { sw: 30 }) +
      rect(520, 560, 300, 300, { sw: 30 }) +
      rect(350, 260, 300, 300, { sw: 30 }) +
      circle(330, 710, 56, { fill: K, sw: 0, stroke: 'none' }) +
      circle(670, 710, 56, { fill: K, sw: 0, stroke: 'none' }) +
      circle(500, 410, 56, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '鞋子', draw: () =>
      path('M 280 220 L 450 220 L 450 540 Q 450 620 530 650 L 780 700 Q 870 718 870 760 L 870 790 L 280 790 Q 230 790 230 740 L 230 280 Q 230 220 280 220 Z', { sw: 30 }) +
      path('M 230 700 L 870 700', { sw: 26 }) +
      line(320, 320, 320, 460, { sw: 22 }) + line(400, 320, 400, 460, { sw: 22 }) +
      path('M 520 660 Q 640 700 760 730', { sw: 22 }) },
  { title: '襪子', draw: () =>
      path('M 380 160 L 640 160 L 640 500 Q 640 590 710 640 Q 800 705 800 780 Q 800 860 700 860 L 440 860 Q 380 860 380 790 Z', { sw: 30 }) +
      line(380, 270, 640, 270, { sw: 22 }) + line(380, 350, 640, 350, { sw: 22 }) +
      path('M 440 860 Q 520 860 520 790', { sw: 22 }) },
  { title: '梳子', draw: () =>
      rect(300, 220, 424, 150, { rx: 50, sw: 30 }) +
      [0, 1, 2, 3, 4, 5, 6].map((i) => line(330 + i * 60, 370, 330 + i * 60, 620, { sw: 22 })).join('') },
  { title: '小足球', draw: () => {
      const pent = ngon(C, C, 175, 5);
      let s = circle(C, C, 365, { sw: 34 }) + poly(pent, { sw: 26 });
      pent.forEach((p) => { const a = Math.atan2(p[1] - C, p[0] - C); s += line(p[0], p[1], C + 365 * Math.cos(a), C + 365 * Math.sin(a), { sw: 22 }); });
      return s;
    } },
  { title: '圍兜', draw: () =>
      path('M 320 260 Q 512 330 704 260 L 760 520 Q 780 720 512 830 Q 244 720 264 520 Z', { sw: 30 }) +
      ellipse(C, 470, 120, 96, { sw: 26 }) },
  { title: '刷子', draw: () =>
      [0, 1, 2, 3].map((i) => line(360 + i * 100, 500, 360 + i * 100, 640, { sw: 24 })).join('') +
      rect(320, 260, 384, 250, { rx: 60, fill: '#fff', sw: 30 }) +
      rect(452, 510, 120, 380, { rx: 50, fill: '#fff', sw: 30 }) },
  { title: '書本', draw: () =>
      path('M 512 300 Q 380 200 200 230 L 200 780 Q 380 750 512 830 Z', { sw: 28 }) +
      path('M 512 300 Q 644 200 824 230 L 824 780 Q 644 750 512 830 Z', { sw: 28 }) +
      line(512, 300, 512, 830, { sw: 26 }) },
];

/* ------------------------------------------------------------------ 交通工具 */
const vehicle = [
  { title: '轎車', draw: () =>
      circle(340, 720, 84, { sw: 30 }) + circle(700, 720, 84, { sw: 30 }) +
      path('M 170 640 L 220 520 Q 250 460 330 460 L 470 460 Q 560 460 640 520 L 780 560 Q 840 580 840 640 L 840 700 L 170 700 Z', { fill: '#fff', sw: 30 }) +
      dot(340, 720, 32) + dot(700, 720, 32) },
  { title: '巴士', draw: () =>
      circle(320, 700, 82, { sw: 30 }) + circle(704, 700, 82, { sw: 30 }) +
      rect(150, 300, 724, 380, { rx: 60, fill: '#fff', sw: 30 }) +
      [0, 1, 2].map((i) => rect(220 + i * 200, 380, 150, 150, { fill: '#fff', sw: 24 })).join('') +
      dot(320, 700, 30) + dot(704, 700, 30) },
  { title: '火車', draw: () =>
      circle(300, 780, 70, { sw: 28 }) + circle(560, 780, 70, { sw: 28 }) + circle(800, 780, 70, { sw: 28 }) +
      rect(210, 320, 130, 110, { fill: '#fff', sw: 26 }) +
      rect(150, 420, 560, 340, { fill: '#fff', sw: 30 }) +
      rect(710, 300, 180, 460, { fill: '#fff', sw: 30 }) +
      rect(760, 380, 80, 110, { fill: '#fff', sw: 24 }) +
      rect(220, 500, 140, 120, { fill: '#fff', sw: 24 }) + rect(400, 500, 140, 120, { fill: '#fff', sw: 24 }) },
  { title: '飛機', draw: () =>
      poly([[190, 560], [60, 470], [60, 650]], { sw: 28 }) +
      poly([[512, 430], [700, 230], [760, 250], [660, 450]], { sw: 26 }) +
      poly([[512, 660], [700, 860], [760, 840], [660, 640]], { sw: 26 }) +
      ellipse(512, 560, 380, 130, { fill: '#fff', sw: 30 }) +
      dot(300, 540, 34) + dot(420, 540, 34) },
  { title: '帆船', draw: () =>
      path('M 180 640 L 860 640 L 740 810 L 300 810 Z', { fill: '#fff', sw: 30 }) +
      line(512, 640, 512, 200, { sw: 28 }) +
      path('M 500 230 L 500 600 L 250 600 Z', { fill: '#fff', sw: 26 }) +
      path('M 540 300 L 540 600 L 760 600 Z', { fill: '#fff', sw: 26 }) },
  { title: '火箭', draw: () =>
      path('M 440 720 L 470 860 L 512 790 L 554 860 L 584 720', { sw: 26 }) +
      poly([[384, 560], [270, 760], [384, 730]], { sw: 28 }) +
      poly([[640, 560], [754, 760], [640, 730]], { sw: 28 }) +
      path('M 512 150 Q 640 320 640 520 L 640 700 L 384 700 L 384 520 Q 384 320 512 150 Z', { fill: '#fff', sw: 30 }) +
      circle(512, 440, 74, { fill: '#fff', sw: 28 }) },
  { title: '腳踏車', draw: () =>
      circle(280, 640, 170, { sw: 30 }) + circle(744, 640, 170, { sw: 30 }) +
      path('M 280 640 L 430 400 L 640 400 L 744 640', { sw: 28 }) +
      path('M 430 400 L 560 640 L 744 640', { sw: 28 }) +
      path('M 620 400 L 660 320 L 740 320', { sw: 26 }) +
      circle(560, 640, 36, { sw: 24 }) },
  { title: '卡車', draw: () =>
      circle(280, 740, 76, { sw: 30 }) + circle(600, 740, 76, { sw: 30 }) + circle(790, 740, 76, { sw: 30 }) +
      rect(140, 400, 420, 320, { fill: '#fff', sw: 30 }) +
      path('M 560 480 L 700 480 L 880 620 L 880 720 L 560 720 Z', { fill: '#fff', sw: 30 }) },
  { title: '直升機', draw: () =>
      line(300, 340, 640, 340, { sw: 26 }) +
      rect(680, 470, 200, 80, { sw: 26 }) +
      poly([[860, 510], [930, 430], [960, 520]], { sw: 24 }) +
      line(330, 740, 620, 740, { sw: 26 }) + line(360, 640, 360, 740, { sw: 24 }) + line(580, 640, 580, 740, { sw: 24 }) +
      ellipse(470, 560, 250, 180, { fill: '#fff', sw: 30 }) +
      line(470, 340, 470, 400, { sw: 24 }) },
  { title: '曳引機', draw: () =>
      circle(320, 740, 90, { sw: 30 }) +
      circle(790, 620, 190, { sw: 34 }) + circle(790, 620, 70, { sw: 26 }) +
      rect(300, 430, 380, 300, { fill: '#fff', sw: 30 }) +
      rect(420, 280, 130, 150, { fill: '#fff', sw: 28 }) +
      line(470, 280, 470, 170, { sw: 24 }) +
      path('M 300 430 L 180 520 L 300 520', { sw: 26 }) },
  { title: '救護車', draw: () =>
      circle(300, 740, 76, { sw: 30 }) + circle(700, 740, 76, { sw: 30 }) +
      rect(140, 400, 520, 320, { fill: '#fff', sw: 30 }) +
      path('M 660 490 L 780 490 L 890 600 L 890 720 L 660 720 Z', { fill: '#fff', sw: 30 }) +
      rect(250, 470, 120, 90, { fill: '#fff', sw: 24 }) + rect(420, 470, 120, 90, { fill: '#fff', sw: 24 }) +
      rect(410, 530, 80, 26, { sw: 0, fill: K }) + rect(437, 503, 26, 80, { sw: 0, fill: K }) },
  { title: '機車', draw: () =>
      circle(280, 700, 160, { sw: 30 }) + circle(760, 700, 160, { sw: 30 }) +
      path('M 280 700 L 440 480 L 700 480 L 760 700', { sw: 28 }) +
      path('M 440 480 L 560 700 L 760 700', { sw: 28 }) +
      line(660, 480, 700, 380, { sw: 26 }) + line(660, 380, 780, 380, { sw: 26 }) +
      circle(560, 700, 34, { sw: 24 }) },
];

/* ------------------------------------------------------------------ 水果食物 */
const food = [
  { title: '蘋果', draw: () =>
      path('M 512 300 Q 380 230 280 320 Q 180 420 250 560 Q 320 700 512 720 Q 704 700 774 560 Q 844 420 744 320 Q 644 230 512 300 Z', { fill: '#fff', sw: 30 }) +
      line(512, 300, 512, 190, { sw: 26 }) +
      path('M 520 200 Q 620 130 700 180 Q 640 250 520 200 Z', { fill: '#fff', sw: 26 }) },
  { title: '香蕉', draw: () =>
      path('M 240 300 Q 300 700 620 730 Q 820 745 840 560 Q 720 660 520 600 Q 340 545 320 300 Z', { sw: 30 }) +
      line(258, 288, 320, 300, { sw: 24 }) },
  { title: '柳橙', draw: () =>
      circle(C, C, 350, { sw: 32 }) +
      [0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60) * Math.PI / 180; return line(C, C, C + 330 * Math.cos(a), C + 330 * Math.sin(a), { sw: 24 }); }).join('') +
      circle(C, C, 56, { sw: 26 }) },
  { title: '洋梨', draw: () =>
      path('M 512 250 Q 560 250 580 310 Q 660 350 680 470 Q 700 620 512 800 Q 324 620 344 470 Q 364 350 444 310 Q 464 250 512 250 Z', { fill: '#fff', sw: 30 }) +
      line(512, 250, 512, 170, { sw: 26 }) +
      path('M 520 180 Q 620 120 690 170 Q 630 230 520 180 Z', { fill: '#fff', sw: 26 }) },
  { title: '葡萄', draw: () =>
      circle(430, 415, 62, { fill: '#fff', sw: 26 }) + circle(520, 395, 60, { fill: '#fff', sw: 26 }) + circle(605, 435, 58, { fill: '#fff', sw: 26 }) +
      circle(395, 505, 58, { fill: '#fff', sw: 26 }) + circle(490, 485, 60, { fill: '#fff', sw: 26 }) + circle(580, 525, 55, { fill: '#fff', sw: 26 }) +
      circle(450, 585, 56, { fill: '#fff', sw: 26 }) + circle(538, 592, 54, { fill: '#fff', sw: 26 }) +
      line(472, 330, 472, 200, { sw: 26 }) +
      path('M 480 212 Q 590 152 660 202 Q 590 252 480 212 Z', { fill: '#fff', sw: 24 }) },
  { title: '西瓜', draw: () =>
      path('M 140 520 L 884 520 A 372 372 0 0 1 140 520 Z', { sw: 30 }) +
      path('M 200 500 L 824 500', { sw: 18 }) +
      [300, 400, 512, 624, 724].map((x, i) => ellipse(x, 590 + (i % 2) * 70, 26, 34, { fill: K, sw: 0, stroke: 'none' })).join('') },
  { title: '草莓', draw: () =>
      poly([[400, 300], [512, 210], [624, 300], [512, 340]], { sw: 26 }) +
      line(512, 300, 512, 200, { sw: 24 }) +
      path('M 512 320 Q 250 300 250 520 Q 250 720 512 830 Q 774 720 774 520 Q 774 300 512 320 Z', { fill: '#fff', sw: 30 }) +
      [400, 512, 624].map((x, i) => [430, 530, 630].map((y, j) => (i + j) % 2 === 0 ? ellipse(x, y, 22, 28, { fill: K, sw: 0, stroke: 'none' }) : '').join('')).join('') },
  { title: '檸檬', draw: () =>
      ellipse(C, C, 280, 210, { sw: 30 }) +
      poly([[248, C], [150, C - 46], [150, C + 46]], { sw: 24 }) +
      poly([[776, C], [874, C - 46], [874, C + 46]], { sw: 24 }) +
      ellipse(C, C, 104, 76, { sw: 24 }) },
  { title: '胡蘿蔔', draw: () =>
      [0, 1, 2].map((i) => path(`M 512 300 Q ${460 - i * 20} 200 ${420 - i * 30} 130`, { sw: 24 })).join('') +
      path('M 512 300 Q 564 200 604 130', { sw: 24 }) +
      path('M 512 300 Q 610 460 640 620 Q 660 760 512 850 Q 364 760 384 620 Q 414 460 512 300 Z', { fill: '#fff', sw: 30 }) +
      line(470, 560, 560, 590, { sw: 22 }) + line(500, 680, 580, 700, { sw: 22 }) },
  { title: '雞蛋', draw: () =>
      path('M 512 200 Q 690 200 730 480 Q 760 720 512 830 Q 264 720 294 480 Q 334 200 512 200 Z', { sw: 32 }) },
  { title: '麵包', draw: () =>
      path('M 180 740 L 180 520 Q 180 300 512 300 Q 844 300 844 520 L 844 740 Z', { fill: '#fff', sw: 30 }) +
      rect(180, 660, 664, 90, { fill: '#fff', sw: 26 }) +
      line(300, 380, 300, 620, { sw: 20 }) + line(724, 380, 724, 620, { sw: 20 }) },
  { title: '冰淇淋', draw: () =>
      poly([[360, 480], [664, 480], [512, 880]], { fill: '#fff', sw: 30 }) +
      circle(400, 400, 130, { fill: '#fff', sw: 30 }) + circle(624, 400, 130, { fill: '#fff', sw: 30 }) + circle(512, 300, 140, { fill: '#fff', sw: 30 }) +
      path('M 360 480 Q 400 560 450 490', { sw: 22 }) },
];

/* ------------------------------------------------------------------ 天氣自然 */
const nature = [
  { title: '太陽', draw: () =>
      circle(C, C, 250, { sw: 32 }) +
      ring(C, C, 380, 12).map((p) => line(C + 250 * Math.cos(Math.atan2(p[1] - C, p[0] - C)), C + 250 * Math.sin(Math.atan2(p[1] - C, p[0] - C)), p[0], p[1], { sw: 26 })).join('') },
  { title: '雲朵', draw: () =>
      path(blobPath([[370, 530, 160], [520, 505, 185], [660, 540, 150]], { baseline: 690, samples: 120 }), { fill: '#fff', sw: 30 }) +
      path('M 240 690 L 784 690', { sw: 30 }) },
  { title: '下雨', draw: () =>
      path(blobPath([[370, 400, 160], [520, 375, 185], [660, 410, 150]], { baseline: 560, samples: 120 }), { fill: '#fff', sw: 28 }) +
      path('M 250 560 L 774 560', { sw: 28 }) +
      [330, 450, 570, 690].map((x, i) => line(x, 620, x - 30, 780, { sw: 24 })).join('') },
  { title: '下雪', draw: () =>
      path(blobPath([[370, 380, 160], [520, 355, 185], [660, 390, 150]], { baseline: 540, samples: 120 }), { fill: '#fff', sw: 28 }) +
      path('M 250 540 L 774 540', { sw: 28 }) +
      [330, 512, 690].map((cx) => {
        const s = [];
        for (let i = 0; i < 6; i++) { const a = (i * 60) * Math.PI / 180; s.push(line(cx, 680, cx + 70 * Math.cos(a), 680 + 70 * Math.sin(a), { sw: 20 })); }
        return s.join('');
      }).join('') },
  { title: '月亮', draw: () =>
      path('M 620 180 Q 380 300 380 512 Q 380 740 640 850 Q 460 850 320 720 Q 140 560 220 360 Q 300 160 620 180 Z', { sw: 32 }) +
      circle(700, 330, 36, { fill: K, sw: 0, stroke: 'none' }) + circle(760, 520, 26, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '大樹', draw: () =>
      path(blobPath([[330, 480, 170], [512, 400, 200], [694, 480, 170]], { samples: 120 }), { fill: '#fff', sw: 30 }) +
      rect(452, 540, 120, 320, { fill: '#fff', sw: 28 }) +
      path('M 500 620 Q 470 560 438 520', { sw: 22 }) + path('M 524 620 Q 554 560 586 520', { sw: 22 }) },
  { title: '花朵', draw: () =>
      path(blobPath(ring(C, C, 150, 6).map((p) => [p[0], p[1], 122]), { samples: 120 }), { fill: '#fff', sw: 28 }) +
      circle(C, C, 105, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '葉子', draw: () =>
      path('M 220 800 Q 220 300 830 200 Q 850 760 300 840 Z', { sw: 30 }) +
      line(250, 810, 790, 250, { sw: 26 }) +
      [430, 540, 650].map((p) => path(`M ${p} ${860 - p + 110} l -70 -70 M ${p} ${860 - p + 110} l 70 -70`, { sw: 20 })).join('') },
  { title: '彩虹', draw: () =>
      path(arcPath(C, 700, 400, 180, 360), { sw: 26 }) +
      path(arcPath(C, 700, 320, 180, 360), { sw: 26 }) +
      path(arcPath(C, 700, 240, 180, 360), { sw: 26 }) +
      path('M 112 700 L 112 870 M 912 700 L 912 870', { sw: 24 }) },
  { title: '山脈', draw: () =>
      poly([[120, 800], [360, 300], [560, 800]], { sw: 30 }) +
      poly([[420, 800], [680, 380], [920, 800]], { sw: 30 }) +
      poly([[330, 400], [360, 300], [392, 400]], { sw: 20 }) +
      path('M 120 800 L 920 800', { sw: 26 }) },
  { title: '星星', draw: () =>
      poly(starPoints(C, C, 400, 170, 5), { sw: 30 }) +
      poly(starPoints(C, C, 190, 80, 5), { fill: K, sw: 0, stroke: 'none' }) },
  { title: '雨傘', draw: () =>
      path('M 512 168 L 512 760 Q 512 840 412 840 Q 332 840 332 776', { sw: 30 }) +
      path('M 140 540 A 372 372 0 0 1 884 540 Z', { fill: '#fff', sw: 30 }) +
      path('M 140 540 L 884 540', { sw: 26 }) },
];

/* ------------------------------------------------------------------ 海洋世界 */
const ocean = [
  { title: '鯨魚', draw: () =>
      poly([[820, 460], [962, 368], [930, 540]], { sw: 28 }) +
      poly([[820, 610], [962, 700], [930, 540]], { sw: 28 }) +
      path('M 180 520 Q 260 340 560 340 Q 760 340 830 470 Q 880 540 830 610 Q 740 720 560 700 Q 320 680 180 520 Z', { fill: '#fff', sw: 30 }) +
      circle(320, 470, 34, { fill: K, sw: 0, stroke: 'none' }) +
      path('M 380 330 Q 400 240 470 260', { sw: 22 }) },
  { title: '螃蟹', draw: () =>
      [0, 1, 2].map((i) => path(`M ${300 - i * 10} 640 q -90 ${60 + i * 20} -150 ${20 + i * 30}`, { sw: 22 })).join('') +
      [0, 1, 2].map((i) => path(`M ${724 + i * 10} 640 q 90 ${60 + i * 20} 150 ${20 + i * 30}`, { sw: 22 })).join('') +
      path('M 300 470 Q 180 400 150 300 Q 250 300 320 400', { sw: 26 }) +
      path('M 724 470 Q 844 400 874 300 Q 774 300 704 400', { sw: 26 }) +
      ellipse(C, 560, 240, 170, { fill: '#fff', sw: 30 }) +
      dot(420, 440, 40) + dot(604, 440, 40) },
  { title: '章魚', draw: () =>
      [0, 1, 2, 3].map((i) => {
        const x = 330 + i * 120;
        const dir = i < 2 ? -1 : 1;
        return path(`M ${x} 590 q ${dir * 90} 120 ${dir * 20} 220 q ${dir * 40} 60 ${dir * 90} 10`, { sw: 26 });
      }).join('') +
      circle(C, 400, 210, { fill: '#fff', sw: 30 }) +
      eye(430, 370, 46) + eye(594, 370, 46) },
  { title: '海星', draw: () =>
      poly(starPoints(C, C, 400, 180, 5, -90), { sw: 32 }) +
      ring(C, C, 110, 5).map((p) => dot(p[0], p[1], 26)).join('') },
  { title: '水母', draw: () =>
      [330, 420, 512, 604, 694].map((x, i) => path(`M ${x} 540 q ${i % 2 ? 50 : -50} 110 0 220 q ${i % 2 ? -50 : 50} 100 0 170`, { sw: 22 })).join('') +
      path('M 250 520 Q 250 250 512 250 Q 774 250 774 520 Z', { fill: '#fff', sw: 30 }) +
      path('M 250 520 Q 512 560 774 520', { sw: 26 }) },
  { title: '海馬', draw: () =>
      circle(300, 830, 24, { sw: 18 }) + circle(360, 884, 16, { sw: 16 }) +
      path('M 690 250 Q 500 250 470 460 Q 440 660 300 690 Q 230 700 225 760 Q 220 812 275 800 Q 330 790 340 740', { sw: 32 }) +
      path('M 640 200 Q 762 190 792 250 Q 762 302 645 302', { sw: 26 }) +
      dot(560, 330, 26) },
  { title: '貝殼', draw: () =>
      path('M 180 780 Q 180 300 512 220 Q 844 300 844 780 Q 512 860 180 780 Z', { sw: 30 }) +
      line(512, 240, 512, 800, { sw: 24 }) +
      path('M 512 240 Q 400 520 380 790', { sw: 22 }) + path('M 512 240 Q 624 520 644 790', { sw: 22 }) +
      path('M 512 240 Q 300 520 280 790', { sw: 20 }) + path('M 512 240 Q 724 520 744 790', { sw: 20 }) },
  { title: '珊瑚', draw: () =>
      path('M 512 880 L 512 560', { sw: 34 }) +
      path('M 512 700 Q 380 660 330 520 Q 300 430 250 380', { sw: 28 }) +
      path('M 512 740 Q 660 700 710 560 Q 740 470 790 420', { sw: 28 }) +
      path('M 512 580 Q 430 520 420 400 Q 415 320 380 250', { sw: 26 }) +
      path('M 512 620 Q 600 560 610 430 Q 615 340 660 270', { sw: 26 }) +
      path('M 250 880 L 774 880', { sw: 28 }) +
      circle(200, 720, 34, { sw: 20 }) + circle(840, 680, 26, { sw: 18 }) },
  { title: '鯊魚', draw: () =>
      poly([[480, 380], [580, 200], [660, 400]], { sw: 28 }) +
      poly([[300, 640], [380, 800], [480, 680]], { sw: 26 }) +
      path('M 160 520 Q 300 330 620 360 Q 820 380 880 520 Q 820 660 620 680 Q 300 710 160 520 Z', { fill: '#fff', sw: 30 }) +
      dot(360, 470, 34) +
      path('M 560 560 L 660 560 L 610 620 Z', { fill: K, sw: 0, stroke: 'none' }) },
  { title: '魚群', draw: () => {
      const small = (cx, cy, s) =>
        ellipse(cx, cy, 110 * s, 70 * s, { sw: 26 }) +
        poly([[cx + 100 * s, cy], [cx + 190 * s, cy - 60 * s], [cx + 190 * s, cy + 60 * s]], { sw: 24 }) +
        dot(cx - 40 * s, cy - 12 * s, 16 * s);
      return small(300, 330, 1) + small(700, 300, 0.8) + small(470, 640, 1.1) + small(790, 690, 0.65);
    } },
  { title: '海龜', draw: () =>
      g(ellipse(250, 560, 60, 130, { sw: 24 }), { transform: 'rotate(24 250 560)' }) +
      g(ellipse(774, 560, 60, 130, { sw: 24 }), { transform: 'rotate(-24 774 560)' }) +
      circle(800, 520, 90, { fill: '#fff', sw: 28 }) +
      ellipse(C, 520, 280, 200, { fill: '#fff', sw: 30 }) +
      poly([[512, 360], [640, 520], [512, 680], [384, 520]], { sw: 22 }) +
      dot(822, 506, 20) },
  { title: '海浪', draw: () =>
      path(sinePath(120, 904, 400, 120, 2), { sw: 34 }) +
      path(sinePath(120, 904, 580, 120, 2), { sw: 34 }) +
      path(sinePath(120, 904, 760, 120, 2), { sw: 34 }) +
      path('M 120 850 L 904 850', { sw: 26 }) },
];

/* ------------------------------------------------------------------ 農場動物 */
const farm = [
  { title: '乳牛', draw: () =>
      line(320, 740, 320, 860, { sw: 28 }) + line(470, 740, 470, 860, { sw: 28 }) +
      line(660, 740, 660, 860, { sw: 28 }) + line(790, 740, 790, 860, { sw: 28 }) +
      path('M 680 372 Q 638 298 578 266', { sw: 30 }) + path('M 812 372 Q 852 298 912 266', { sw: 30 }) +
      ellipse(C, 560, 290, 195, { fill: '#fff', sw: 30 }) +
      ellipse(390, 500, 88, 68, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(545, 640, 68, 54, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(745, 470, 160, 140, { fill: '#fff', sw: 30 }) +
      ellipse(772, 532, 78, 56, { fill: '#fff', sw: 24 }) +
      dot(745, 526, 15) + dot(797, 526, 15) +
      circle(706, 428, 26, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '馬', draw: () =>
      line(260, 740, 260, 880, { sw: 28 }) + line(380, 740, 380, 880, { sw: 28 }) +
      line(520, 740, 520, 880, { sw: 28 }) + line(620, 740, 620, 880, { sw: 28 }) +
      path('M 180 560 Q 100 620 150 700', { sw: 24 }) +
      poly([[692, 264], [672, 186], [728, 246]], { sw: 24 }) +
      poly([[762, 252], [802, 186], [802, 262]], { sw: 24 }) +
      ellipse(430, 580, 250, 185, { fill: '#fff', sw: 30 }) +
      path('M 580 565 Q 645 425 692 332 Q 722 250 784 252 Q 836 254 836 302 Q 836 342 792 352 Q 758 358 728 330 Q 688 420 662 572 Z', { fill: '#fff', sw: 28 }) +
      dot(774, 290, 24) +
      path('M 662 402 Q 692 318 728 282', { sw: 22 }) },
  { title: '綿羊', draw: () =>
      line(380, 790, 380, 870, { sw: 26 }) + line(540, 800, 540, 870, { sw: 26 }) + line(690, 790, 690, 870, { sw: 26 }) +
      path(blobPath([[370, 600, 150], [500, 505, 150], [625, 600, 145], [435, 705, 125], [565, 715, 125]], { samples: 120 }), { fill: '#fff', sw: 26 }) +
      ellipse(690, 452, 46, 28, { sw: 22 }) +
      ellipse(810, 530, 105, 120, { fill: '#fff', sw: 28 }) +
      dot(832, 500, 22) +
      ellipse(822, 602, 52, 36, { fill: '#fff', sw: 22 }) },  { title: '母雞', draw: () =>
      line(400, 760, 400, 860, { sw: 24 }) + line(540, 760, 540, 860, { sw: 24 }) +
      path('M 360 860 L 440 860 M 500 860 L 580 860', { sw: 20 }) +
      ellipse(470, 580, 220, 190, { fill: '#fff', sw: 30 }) +
      ellipse(430, 560, 110, 80, { fill: '#fff', sw: 24 }) +
      circle(680, 420, 120, { fill: '#fff', sw: 28 }) +
      path('M 680 300 Q 700 250 660 240 Q 700 210 740 250 Q 760 200 790 240 Q 810 280 760 300', { fill: '#fff', sw: 24 }) +
      poly([[740, 400], [850, 430], [740, 470]], { fill: '#fff', sw: 24 }) +
      dot(710, 390, 26) },
  { title: '鴨子', draw: () =>
      line(420, 770, 420, 860, { sw: 24 }) + line(560, 770, 560, 860, { sw: 24 }) +
      ellipse(480, 620, 235, 175, { fill: '#fff', sw: 30 }) +
      ellipse(420, 610, 120, 84, { fill: '#fff', sw: 24 }) +
      path('M 640 545 Q 660 430 700 340 Q 725 268 790 268 Q 845 270 845 318 Q 845 360 800 366 Q 762 372 742 340 Q 700 430 690 565 Z', { fill: '#fff', sw: 28 }) +
      poly([[840, 296], [955, 330], [840, 364]], { fill: '#fff', sw: 24 }) +
      dot(812, 296, 24) },
  { title: '小豬', draw: () =>
      line(360, 740, 360, 860, { sw: 26 }) + line(560, 740, 560, 860, { sw: 26 }) +
      path('M 240 520 Q 160 500 170 430 Q 200 460 240 460', { sw: 24 }) +
      ellipse(480, 560, 250, 190, { fill: '#fff', sw: 30 }) +
      poly([[690, 400], [660, 330], [760, 380]], { sw: 24 }) +
      poly([[830, 400], [870, 330], [780, 380]], { sw: 24 }) +
      ellipse(760, 500, 120, 110, { fill: '#fff', sw: 28 }) +
      ellipse(770, 540, 70, 52, { fill: '#fff', sw: 24 }) +
      dot(748, 540, 16) + dot(792, 540, 16) +
      dot(720, 468, 24) },
  { title: '山羊', draw: () =>
      line(380, 740, 380, 860, { sw: 26 }) + line(580, 740, 580, 860, { sw: 26 }) +
      ellipse(480, 580, 240, 180, { fill: '#fff', sw: 30 }) +
      path('M 690 400 Q 650 300 700 250', { sw: 24 }) + path('M 810 400 Q 850 300 800 250', { sw: 24 }) +
      ellipse(750, 480, 110, 120, { fill: '#fff', sw: 28 }) +
      poly([[720, 430], [700, 470], [740, 470]], { sw: 22 }) + poly([[800, 430], [820, 470], [780, 470]], { sw: 22 }) +
      path('M 762 540 Q 752 620 782 660', { sw: 22 }) +
      dot(716, 470, 24) },
  { title: '驢子', draw: () =>
      line(350, 760, 350, 880, { sw: 26 }) + line(560, 760, 560, 880, { sw: 26 }) +
      path('M 220 560 Q 140 540 150 470', { sw: 24 }) +
      ellipse(460, 600, 250, 180, { fill: '#fff', sw: 30 }) +
      g(ellipse(690, 300, 46, 130, { sw: 24 }), { transform: 'rotate(-14 690 300)' }) +
      g(ellipse(800, 300, 46, 130, { sw: 24 }), { transform: 'rotate(14 800 300)' }) +
      ellipse(740, 480, 120, 130, { fill: '#fff', sw: 28 }) +
      ellipse(770, 560, 70, 54, { fill: '#fff', sw: 24 }) +
      dot(716, 470, 24) },
  { title: '鵝', draw: () =>
      line(380, 790, 380, 880, { sw: 24 }) + line(520, 790, 520, 880, { sw: 24 }) +
      ellipse(430, 650, 215, 155, { fill: '#fff', sw: 30 }) +
      ellipse(395, 630, 120, 80, { fill: '#fff', sw: 24 }) +
      path('M 600 590 Q 620 450 640 330 Q 655 232 730 232 Q 795 234 795 288 Q 795 336 744 344 Q 706 350 690 320 Q 656 440 646 610 Z', { fill: '#fff', sw: 28 }) +
      poly([[790, 258], [905, 292], [790, 326]], { fill: '#fff', sw: 24 }) +
      dot(756, 258, 22) },
  { title: '火雞', draw: () =>
      line(420, 790, 420, 870, { sw: 24 }) + line(540, 790, 540, 870, { sw: 24 }) +
      [0, 1, 2, 3, 4].map((i) => path(`M 320 520 Q ${180 - i * 10} ${420 - i * 40} ${250 - i * 20} ${330 - i * 50}`, { sw: 22 })).join('') +
      ellipse(480, 620, 210, 180, { fill: '#fff', sw: 30 }) +
      circle(520, 380, 130, { fill: '#fff', sw: 28 }) +
      poly([[520, 250], [560, 300], [480, 300]], { fill: '#fff', sw: 22 }) +
      dot(560, 360, 24) +
      path('M 480 318 Q 520 282 560 318', { sw: 22 }) },
  { title: '孔雀', draw: () =>
      line(430, 800, 430, 880, { sw: 24 }) + line(520, 800, 520, 880, { sw: 24 }) +
      [0, 1, 2, 3, 4, 5].map((i) => path(`M 380 520 Q ${180 - i * 6} ${400 - i * 30} ${230 - i * 14} ${240 - i * 26}`, { sw: 22 })).join('') +
      ring(280, 400, 200, 7).map((p) => ellipse(p[0], p[1], 26, 34, { sw: 18 })).join('') +
      ellipse(460, 640, 170, 200, { fill: '#fff', sw: 28 }) +
      circle(500, 420, 110, { fill: '#fff', sw: 26 }) +
      poly([[540, 390], [620, 400], [540, 420]], { fill: '#fff', sw: 22 }) +
      dot(540, 388, 20) },
  { title: '貓頭鷹', draw: () =>
      poly([[300, 300], [340, 180], [440, 270]], { sw: 26 }) + poly([[724, 300], [684, 180], [584, 270]], { sw: 26 }) +
      ellipse(C, 560, 260, 300, { fill: '#fff', sw: 30 }) +
      circle(410, 480, 110, { fill: '#fff', sw: 28 }) + circle(614, 480, 110, { fill: '#fff', sw: 28 }) +
      dot(410, 480, 44) + dot(614, 480, 44) +
      poly([[512, 560], [566, 610], [512, 660], [458, 610]], { fill: K, sw: 0, stroke: 'none' }) +
      [0, 1, 2].map((i) => path(`M 380 ${700 + i * 60} q 60 ${40 + i * 20} 120 0`, { sw: 20 })).join('') },
];

/* ------------------------------------------------------------------ 太空世界 */
const space = [
  { title: '太陽', draw: () =>
      circle(C, C, 240, { sw: 32 }) +
      ring(C, C, 370, 12).map((p) => line(C + 240 * Math.cos(Math.atan2(p[1] - C, p[0] - C)), C + 240 * Math.sin(Math.atan2(p[1] - C, p[0] - C)), p[0], p[1], { sw: 24 })).join('') +
      circle(440, 440, 34, { fill: K, sw: 0, stroke: 'none' }) + circle(600, 580, 26, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '行星', draw: () =>
      ellipse(C, C, 400, 130, { sw: 28 }) +
      circle(C, C, 250, { fill: '#fff', sw: 32 }) +
      dot(440, 450, 46) + dot(600, 570, 34) },
  { title: '小火箭', draw: () =>
      path('M 450 700 L 476 840 L 512 790 L 548 840 L 574 700', { sw: 26 }) +
      poly([[394, 550], [290, 750], [394, 720]], { sw: 28 }) +
      poly([[630, 550], [734, 750], [630, 720]], { sw: 28 }) +
      path('M 512 150 Q 630 320 630 520 L 630 690 L 394 690 L 394 520 Q 394 320 512 150 Z', { fill: '#fff', sw: 30 }) +
      circle(512, 430, 70, { fill: '#fff', sw: 28 }) },
  { title: '彗星', draw: () =>
      circle(720, 320, 110, { sw: 30 }) +
      path('M 640 380 Q 500 420 400 520 Q 320 600 220 700', { sw: 28 }) +
      path('M 660 430 Q 520 500 400 620', { sw: 22 }) +
      path('M 700 250 Q 620 190 540 180', { sw: 22 }) },
  { title: '太空人', draw: () =>
      rect(300, 570, 90, 180, { rx: 40, sw: 26 }) + rect(634, 570, 90, 180, { rx: 40, sw: 26 }) +
      circle(C, 330, 190, { fill: '#fff', sw: 32 }) +
      ellipse(C, 330, 132, 106, { fill: '#fff', sw: 26 }) +
      dot(460, 330, 26) + dot(566, 330, 26) +
      path('M 340 560 L 684 560 L 740 860 L 284 860 Z', { fill: '#fff', sw: 30 }) +
      rect(440, 680, 144, 120, { fill: '#fff', sw: 26 }) },
  { title: '衛星', draw: () =>
      rect(430, 400, 164, 220, { sw: 28 }) +
      rect(140, 440, 260, 140, { sw: 26 }) + rect(624, 440, 260, 140, { sw: 26 }) +
      line(400, 470, 430, 470, { sw: 22 }) + line(594, 470, 624, 470, { sw: 22 }) +
      path('M 512 400 L 512 290 M 430 620 L 512 620 L 594 620', { sw: 24 }) +
      ellipse(512, 250, 70, 34, { sw: 24 }) },
  { title: '幽浮', draw: () =>
      path('M 250 560 Q 250 300 512 300 Q 774 300 774 560 Q 640 640 512 640 Q 384 640 250 560 Z', { fill: '#fff', sw: 32 }) +
      ellipse(512, 640, 262, 80, { fill: '#fff', sw: 30 }) +
      dot(390, 520, 44) + dot(634, 520, 44) +
      [330, 400, 470, 540, 610, 680].map((x) => dot(x, 700, 20)).join('') },
  { title: '流星', draw: () =>
      path('M 200 820 L 700 320', { sw: 34 }) +
      path('M 300 830 L 760 380', { sw: 22 }) +
      poly(starPoints(760, 260, 150, 62, 5), { fill: K, sw: 0, stroke: 'none' }) },
  { title: '星座', draw: () => {
      const pts = [[220, 260], [420, 400], [320, 640], [620, 700], [760, 460], [520, 180]];
      return pts.map((p) => dot(p[0], p[1], 40)).join('') +
        pts.map((p, i) => (i < pts.length - 1 ? line(p[0], p[1], pts[i + 1][0], pts[i + 1][1], { sw: 20 }) : '')).join('');
    } },
  { title: '隕石坑', draw: () =>
      ellipse(C, C, 380, 200, { sw: 32 }) +
      ellipse(C, C - 30, 220, 110, { sw: 26 }) +
      path('M 200 640 Q 512 800 824 640', { sw: 24 }) +
      dot(300, 620, 22) + dot(720, 600, 18) },
  { title: '望遠鏡', draw: () =>
      g(rect(360, 300, 340, 150, { rx: 70, sw: 30, fill: '#fff' }), { transform: 'rotate(-32 530 375)' }) +
      circle(706, 266, 78, { fill: '#fff', sw: 30 }) +
      g(rect(316, 416, 112, 100, { rx: 42, sw: 28, fill: '#fff' }), { transform: 'rotate(-32 530 375)' }) +
      circle(505, 480, 34, { sw: 24 }) +
      line(505, 480, 370, 880, { sw: 26 }) + line(505, 480, 650, 880, { sw: 26 }) + line(505, 480, 512, 880, { sw: 24 }) },
  { title: '外星人', draw: () =>
      path('M 512 220 Q 700 220 700 460 Q 700 620 512 720 Q 324 620 324 460 Q 324 220 512 220 Z', { sw: 30 }) +
      ellipse(420, 420, 80, 56, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(604, 420, 80, 56, { fill: K, sw: 0, stroke: 'none' }) +
      ellipse(512, 600, 70, 40, { sw: 26 }) +
      path('M 420 600 L 604 600', { sw: 24 }) },
];

/* ------------------------------------------------------------------ 數量點數 */
const count = [
  { title: '1 點', draw: () => dot(C, C, 150) },
  { title: '2 點', draw: () => dot(400, C, 120) + dot(624, C, 120) },
  { title: '3 點', draw: () => dot(512, 340, 120) + dot(340, 660, 120) + dot(684, 660, 120) },
  { title: '4 點', draw: () => dot(340, 340, 120) + dot(684, 340, 120) + dot(340, 684, 120) + dot(684, 684, 120) },
  { title: '5 點', draw: () => [340, 512, 684].map((x) => dot(x, 340, 118)).join('') + [340, 684].map((x) => dot(x, 684, 118)).join('') + dot(512, 512, 118) },
  { title: '6 點', draw: () => [340, 512, 684].map((x) => dot(x, 340, 112)).join('') + [340, 512, 684].map((x) => dot(x, 684, 112)).join('') },
  { title: '7 點', draw: () => [280, 440, 600, 760].map((x) => dot(x, 320, 96)).join('') + [280, 440, 600, 760].map((x) => dot(x, 560, 96)).join('') + dot(360, 800, 96) },
  { title: '8 點', draw: () => [340, 512, 684].map((x) => dot(x, 300, 96)).join('') + [340, 512, 684].map((x) => dot(x, 500, 96)).join('') + [340, 512, 684].map((x) => dot(x, 700, 96)).join('') + dot(430, 850, 88) },
  { title: '9 點', draw: () => [280, 440, 600, 760].map((x) => dot(x, 280, 84)).join('') + [280, 440, 600, 760].map((x) => dot(x, 480, 84)).join('') + [280, 440, 600, 760].map((x) => dot(x, 680, 84)).join('') },
  { title: '10 點', draw: () => [300, 470, 640, 810].map((x) => dot(x, 300, 84)).join('') + [300, 470, 640, 810].map((x) => dot(x, 500, 84)).join('') + [300, 470, 640, 810].map((x) => dot(x, 700, 84)).join('') },
  { title: '12 點', draw: () => [280, 420, 560, 700].map((x) => dot(x, 300, 76)).join('') + [280, 420, 560, 700].map((x) => dot(x, 460, 76)).join('') + [280, 420, 560, 700].map((x) => dot(x, 620, 76)).join('') },
  { title: '散點', draw: () => [[300, 300, 80], [520, 260, 60], [700, 360, 90], [380, 560, 70], [620, 540, 55], [280, 760, 65], [520, 800, 90], [740, 720, 60]].map(([x, y, r]) => dot(x, y, r)).join('') },
];

/* ------------------------------------------------------------------ 對稱花紋 */
const pattern = [
  { title: '鋸齒帶', draw: () => {
      let d = 'M 100 512';
      for (let i = 0; i < 6; i++) d += ` L ${100 + i * 140} ${i % 2 ? 300 : 724} L ${170 + i * 140} ${i % 2 ? 300 : 724}`;
      return path(d, { sw: 32 });
    } },
  { title: '菱形格', draw: () => {
      const B = 168, E = 856, step = 132;
      let s = '';
      for (let k = B + B; k <= E + E; k += step) {
        const xa = Math.max(B, k - E), xb = Math.min(E, k - B);
        if (xb - xa > 8) s += line(xa, k - xa, xb, k - xb, { sw: 22 });
      }
      for (let m = B - E; m <= E - B; m += step) {
        const xa = Math.max(B, B + m), xb = Math.min(E, E + m);
        if (xb - xa > 8) s += line(xa, xa - m, xb, xb - m, { sw: 22 });
      }
      return s;
    } },
  { title: '圓點格', draw: () => {
      let s = '';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += dot(200 + i * 208, 200 + j * 208, 46);
      return s;
    } },
  { title: '同心方', draw: () => rect(140, 140, 744, 744, { sw: 30 }) + rect(300, 300, 424, 424, { sw: 30 }) + rect(440, 440, 144, 144, { sw: 30 }) },
  { title: '放射線', draw: () => ring(C, C, 400, 12).map((p) => line(C, C, p[0], p[1], { sw: 26 })).join('') + circle(C, C, 120, { sw: 28 }) },
  { title: '波浪帶', draw: () => path(sinePath(100, 924, 400, 130, 2), { sw: 30 }) + path(sinePath(100, 924, 624, 130, 2), { sw: 30 }) },
  { title: '圓形棋盤', draw: () => {
      let s = circle(C, C, 400, { sw: 30 });
      const cell = 160, o = C - 3 * cell / 2;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) s += rect(o + i * cell, o + j * cell, cell, cell, { fill: K, sw: 0, stroke: 'none' });
      }
      return s;
    } },
  { title: '弧線排', draw: () => [440, 340, 240, 140].map((r, i) => path(arcPath(140 + i * 190, 880, r, -90, 0), { sw: 24 })).join('') },
  { title: '十字條紋', draw: () => {
      let s = '';
      for (let i = 0; i < 6; i++) s += line(140, 240 + i * 108, 884, 240 + i * 108, { sw: 26 });
      for (let i = 0; i < 6; i++) s += line(240 + i * 108, 140, 240 + i * 108, 884, { sw: 26 });
      return s;
    } },
  { title: '花瓣圖', draw: () => ring(C, C, 190, 8).map((p) => ellipse(p[0], p[1], 80, 180, { fill: '#fff', sw: 26, transform: `rotate(${(Math.atan2(p[1] - C, p[0] - C) * 180) / Math.PI} ${p[0]} ${p[1]})` })).join('') + circle(C, C, 90, { fill: K, sw: 0, stroke: 'none' }) },
  { title: '網格點', draw: () => {
      let s = '';
      for (let i = 0; i < 5; i++) s += line(160 + i * 176, 160, 160 + i * 176, 864, { sw: 22 });
      for (let i = 0; i < 5; i++) s += line(160, 160 + i * 176, 864, 160 + i * 176, { sw: 22 });
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i + j) % 2 === 0) s += dot(160 + i * 176, 160 + j * 176, 34);
      return s;
    } },
  { title: '斜格棋盤', draw: () => {
      const B = 180, E = 844, step = 236;
      let s = rect(B - 20, B - 20, E - B + 40, E - B + 40, { sw: 28 });
      for (let k = B + B; k <= E + E; k += step) {
        const xa = Math.max(B, k - E), xb = Math.min(E, k - B);
        if (xb - xa > 8) s += line(xa, k - xa, xb, k - xb, { sw: 96, cap: 'butt' });
      }
      for (let m = B - E + step / 2; m <= E - B; m += step) {
        const xa = Math.max(B, B + m), xb = Math.min(E, E + m);
        if (xb - xa > 8) s += line(xa, xa - m, xb, xb - m, { sw: 96, cap: 'butt' });
      }
      return s;
    } },
];

/* ------------------------------------------------------------------ 身體部位 */
const body = [
  { title: '手掌', draw: () =>
      path('M 360 640 Q 250 570 282 452', { sw: 30 }) +
      path('M 330 880 L 330 560 Q 330 480 392 480 Q 454 480 454 560 L 454 500 Q 454 420 512 420 Q 570 420 570 500 L 570 560 L 570 440 Q 570 366 626 366 Q 682 366 682 440 L 682 620 Q 682 800 560 880 Z', { fill: '#fff', sw: 30 }) },
  { title: '腳掌', draw: () =>
      [400, 452, 512, 566, 614].map((x, i) => ellipse(x, 330 + (i === 2 ? -20 : 0), 40, 46, { fill: '#fff', sw: 24 })).join('') +
      path('M 330 860 Q 300 620 360 480 Q 400 380 512 380 Q 624 380 664 480 Q 724 620 694 860 Z', { fill: '#fff', sw: 30 }) },
  { title: '眼睛', draw: () =>
      path('M 160 512 Q 512 250 864 512 Q 512 774 160 512 Z', { sw: 32 }) +
      circle(512, 512, 150, { sw: 30 }) + dot(512, 512, 62) +
      path('M 210 400 Q 320 330 430 320', { sw: 22 }) + path('M 814 400 Q 704 330 594 320', { sw: 22 }) },
  { title: '耳朵', draw: () =>
      path('M 620 820 Q 400 700 380 440 Q 370 260 500 250 Q 640 240 680 400 Q 720 560 620 820 Z', { sw: 32 }) +
      path('M 580 740 Q 470 640 470 470 Q 470 360 530 350 Q 590 345 610 440', { sw: 26 }) },
  { title: '鼻子', draw: () =>
      path('M 512 200 Q 330 340 330 560 Q 330 760 512 800 Q 694 760 694 560 Q 694 340 512 200 Z', { sw: 32 }) +
      ellipse(440, 620, 44, 60, { sw: 26 }) + ellipse(584, 620, 44, 60, { sw: 26 }) },
  { title: '嘴唇', draw: () =>
      path('M 512 760 Q 300 700 300 520 Q 300 380 512 430 Q 724 380 724 520 Q 724 700 512 760 Z', { sw: 32 }) +
      path('M 300 520 Q 512 600 724 520', { sw: 28 }) },
  { title: '牙齒', draw: () =>
      path('M 300 300 Q 512 240 724 300 L 700 560 Q 690 800 512 810 Q 334 800 324 560 Z', { sw: 30 }) +
      path('M 400 300 L 400 640 M 512 290 L 512 640 M 624 300 L 624 640', { sw: 22 }) },
  { title: '骨頭', draw: () =>
      line(340, 700, 700, 340, { sw: 40 }) +
      circle(290, 700, 100, { fill: '#fff', sw: 32 }) +
      circle(200, 790, 90, { fill: '#fff', sw: 32 }) +
      circle(734, 340, 100, { fill: '#fff', sw: 32 }) +
      circle(824, 250, 90, { fill: '#fff', sw: 32 }) },
  { title: '心臟', draw: () =>
      path('M 512 840 Q 180 610 180 400 Q 180 220 340 220 Q 440 220 512 320 Q 584 220 684 220 Q 844 220 844 400 Q 844 610 512 840 Z', { sw: 32 }) },
  { title: '手印', draw: () =>
      path('M 330 640 Q 280 570 286 500', { sw: 30 }) +
      path('M 330 640 L 330 620 Q 330 540 392 540 Q 454 540 454 620 L 454 480 Q 454 404 512 404 Q 570 404 570 480 L 570 620 L 570 440 Q 570 366 626 366 Q 682 366 682 440 L 682 660 Q 682 830 540 880 Z', { fill: '#fff', sw: 30 }) },
  { title: '腳印', draw: () =>
      [400, 470, 540, 610].map((x, i) => ellipse(x, 330 + (i === 1 || i === 2 ? -30 : 0), 38, 46, { fill: '#fff', sw: 24 })).join('') +
      ellipse(512, 620, 220, 250, { fill: '#fff', sw: 32 }) },
  { title: '舌頭', draw: () =>
      path('M 512 200 Q 300 260 300 500 Q 300 720 512 840 Q 724 720 724 500 Q 724 260 512 200 Z', { sw: 32 }) +
      path('M 512 380 L 512 660', { sw: 26 }) },
];

export const THEMES = [
  { slug: 'geometric', label: '幾何圖形', desc: '圓、方形、三角與重複紋理，最簡單也最穩定的高對比圖案。', ageNote: '0-2 個月先看大圓點，同心圓次之。', cards: geometric },
  { slug: 'tracking', label: '追視線條', desc: '螺旋、波浪與放射線，適合練緩慢左右移動的追視。', ageNote: '2-4 個月可開始慢慢移動卡片。', cards: tracking },
  { slug: 'animal', label: '動物輪廓', desc: '熟悉動物的簡單輪廓，讓寶寶把圖形對應到真實世界。', ageNote: '2-4 個月可開始命名互動。', cards: animal },
  { slug: 'face', label: '表情臉孔', desc: '眼睛、笑臉與各種表情，模仿人類最愛注視的臉。', ageNote: '0-2 個月最容易被臉吸引。', cards: face },
  { slug: 'object', label: '生活用品', desc: '奶瓶、杯子、梳子等日常物品，連結照顧與遊戲。', ageNote: '3-6 個月可配合生活情境說明。', cards: object },
  { slug: 'vehicle', label: '交通工具', desc: '汽車、火車與飛機，輪廓清楚、辨識度高。', ageNote: '2-4 個月可指認並命名。', cards: vehicle },
  { slug: 'food', label: '水果食物', desc: '蘋果、香蕉與常見食物，幫助建立生活詞彙。', ageNote: '3-6 個月適合配合飲食時間。', cards: food },
  { slug: 'nature', label: '天氣自然', desc: '太陽、雲朵與彩虹，簡單的大形狀與自然物。', ageNote: '0-2 個月看太陽與雲朵。', cards: nature },
  { slug: 'ocean', label: '海洋世界', desc: '鯨魚、章魚與海星，柔和曲線好追蹤。', ageNote: '2-4 個月可慢慢移動並命名。', cards: ocean },
  { slug: 'farm', label: '農場動物', desc: '乳牛、馬與小雞，輪廓紮實、黑白分明。', ageNote: '2-4 個月可配合圖卡說出名字。', cards: farm },
  { slug: 'space', label: '太空世界', desc: '太陽、火箭與星座，神秘又有想像力。', ageNote: '3-6 個月適合玩辨識遊戲。', cards: space },
  { slug: 'count', label: '數量點數', desc: '一點到十二點的排列，幫助留意數量與位置。', ageNote: '3-6 個月可數給寶寶聽。', cards: count },
  { slug: 'pattern', label: '對稱花紋', desc: '重複、放射與網格，長期訓練圖形辨識。', ageNote: '3-6 個月可嘗試複雜一點的花紋。', cards: pattern },
  { slug: 'body', label: '身體部位', desc: '手掌、眼睛與腳印，讓寶寶認識自己的身體。', ageNote: '3-6 個月可一邊摸一邊說。', cards: body },
];

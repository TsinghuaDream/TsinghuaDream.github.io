/**
 * 首页 banner 打字机：每轮随机一句名人警句，打出 → 停顿 → 删除 → 换新的一句
 *
 * 为什么自实现而不用主题 hitokoto / 第三方 API：
 *   - hitokoto 无「励志」分类，诗词类偏伤感、哲学类含政治语录；
 *   - 金山每日一句当天固定同一句，满足不了「每轮新的一句」；
 *   - 其它一言 API 返回重复/空/网易云评论，质量不可控。
 * 故内置精选名句池（技术箴言 + 古典 + 名家 + 科学家），本地随机、零网络依赖。
 * 用 textContent 逐字写入，无 XSS 风险。
 */
(function () {
  var QUOTES = [
    // —— 技术箴言（贴合本站主题）——
    '过早的优化是万恶之源。　——  Donald Knuth',
    '简单是可靠的前提。　——  Edsger W. Dijkstra',
    '先让它跑起来，再让它正确，最后让它快。　——  Kent Beck',
    '好代码是写给人看的，只是顺便能被机器执行。　——  Harold Abelson',
    '预测未来最好的方式，就是亲手创造它。　——  Alan Kay',
    '计算机科学里最难的两件事：缓存失效和命名。　——  Phil Karlton',
    '调试的难度是写代码的两倍，所以别把代码写得太聪明。　——  Brian Kernighan',
    // —— 古典 ——
    '千里之行，始于足下。　——  老子',
    '合抱之木，生于毫末；九层之台，起于累土。　——  老子',
    '知之为知之，不知为不知，是知也。　——  《论语》',
    '工欲善其事，必先利其器。　——  《论语》',
    '学而不思则罔，思而不学则殆。　——  《论语》',
    '博学之，审问之，慎思之，明辨之，笃行之。　——  《礼记·中庸》',
    '苟日新，日日新，又日新。　——  《礼记·大学》',
    '天行健，君子以自强不息。　——  《周易》',
    '问渠那得清如许？为有源头活水来。　——  朱熹',
    '纸上得来终觉浅，绝知此事要躬行。　——  陆游',
    '路漫漫其修远兮，吾将上下而求索。　——  屈原',
    '不积跬步，无以至千里。　——  荀子',
    '业精于勤，荒于嬉；行成于思，毁于随。　——  韩愈',
    '知行合一。　——  王阳明',
    // —— 名家 ——
    '其实地上本没有路，走的人多了，也便成了路。　——  鲁迅',
    '愿中国青年都摆脱冷气，只是向上走。　——  鲁迅',
    '那些杀不死我的，终将使我更强大。　——  尼采',
    '凡是过往，皆为序章。　——  莎士比亚',
    '真正的英雄主义，是认清生活的真相后依然热爱它。　——  罗曼·罗兰',
    '人生的道路虽然漫长，但紧要处常常只有几步。　——  柳青',
    '我思故我在。　——  笛卡尔',
    '人不能两次踏进同一条河流。　——  赫拉克利特',
    // —— 科学家 ——
    '想象力比知识更重要。　——  爱因斯坦',
    '我没有特别的天赋，我只是极度好奇。　——  爱因斯坦',
    '生活就像骑自行车，要保持平衡就得往前走。　——  爱因斯坦',
    '如果我看得更远，那是因为我站在巨人的肩膀上。　——  牛顿',
  ];

  var TYPE_MS = 110;   // 打出每字间隔
  var ERASE_MS = 45;   // 删除每字间隔
  var HOLD_MS = 2400;  // 打完停顿
  var GAP_MS = 500;    // 删完到下一句的间隔
  var lastIdx = -1;

  function pickNext() {
    if (QUOTES.length <= 1) return QUOTES[0] || '';
    var i;
    do { i = Math.floor(Math.random() * QUOTES.length); } while (i === lastIdx);
    lastIdx = i;
    return QUOTES[i];
  }

  function typeIn(node, text, done) {
    var i = 0;
    (function step() {
      node.textContent = text.slice(0, i);
      if (i++ < text.length) setTimeout(step, TYPE_MS);
      else done();
    })();
  }

  function eraseOut(node, done) {
    var text = node.textContent, i = text.length;
    (function step() {
      node.textContent = text.slice(0, i);
      if (i-- > 0) setTimeout(step, ERASE_MS);
      else done();
    })();
  }

  function run(node) {
    (function cycle() {
      typeIn(node, pickNext(), function () {
        setTimeout(function () {
          eraseOut(node, function () { setTimeout(cycle, GAP_MS); });
        }, HOLD_MS);
      });
    })();
  }

  function injectCursorStyle() {
    if (document.getElementById('dq-style')) return;
    var s = document.createElement('style');
    s.id = 'dq-style';
    s.textContent =
      '.dq-cursor{display:inline-block;margin-left:2px;font-weight:400;opacity:1;animation:dq-blink 1s steps(1) infinite}' +
      '@keyframes dq-blink{50%{opacity:0}}';
    document.head.appendChild(s);
  }

  function takeOver() {
    var old = document.getElementById('subtitle');
    if (!old) return;
    var parent = old.parentNode;
    if (!parent) return;
    // 移除主题 Typed 留下的光标（避免双光标）
    Array.prototype.forEach.call(parent.querySelectorAll('.typed-cursor'), function (c) { c.remove(); });
    // 克隆替换：主题的 Typed 实例仍持有旧节点（已脱离 DOM），在后台无害地更新，
    // 我方接管全新节点，互不干扰（主题 Typed 实例存于模块作用域，无法直接销毁）。
    var fresh = old.cloneNode(false);
    var textNode = document.createElement('span');
    textNode.className = 'dq-text';
    var cursor = document.createElement('span');
    cursor.className = 'dq-cursor';
    cursor.textContent = '|';
    fresh.appendChild(textNode);
    fresh.appendChild(cursor);
    parent.replaceChild(fresh, old);
    injectCursorStyle();
    run(textNode);
  }

  // 延迟接管，让主题先完成自己的 Typed 初始化（其固定文案作为无 JS 时的兜底）
  function schedule() { setTimeout(takeOver, 900); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();

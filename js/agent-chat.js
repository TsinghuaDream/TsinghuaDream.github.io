/* 菲尼克斯blog · 数字分身聊天挂件（原生 JS，无依赖） */
(function () {
  var API = "https://agent.xugua.xyz/chat";
  var SID = (function () {
    try {
      var s = localStorage.getItem("pa_sid");
      if (!s) { s = Math.random().toString(36).slice(2, 12); localStorage.setItem("pa_sid", s); }
      return s;
    } catch (e) { return "anon"; }
  })();

  var css = [
    /* 聊天按钮：与主题 side-tools 同尺寸同圆角，用 primary 色区分 */
    "#pa-fab{width:42px;height:42px;border-radius:12px;",
    "background:var(--primary-color,#A31F34);color:var(--background-color,#fff);border:none;cursor:pointer;",
    "font-size:1.3rem;display:flex;align-items:center;justify-content:center;",
    "box-shadow:var(--redefine-box-shadow,0 4px 16px rgba(0,0,0,.25));transition:transform .2s,opacity .2s}",
    "#pa-fab:hover{transform:scale(1.08);opacity:.9}",
    /* 聊天面板 */
    "#pa-box{position:fixed;right:24px;bottom:88px;width:min(360px,calc(100vw - 48px));height:480px;",
    "background:var(--background-color,#fff);color:var(--default-text-color,#222);border-radius:14px;",
    "box-shadow:0 8px 40px rgba(0,0,0,.3);z-index:9999;display:none;flex-direction:column;overflow:hidden;",
    "border:1px solid rgba(128,128,128,.25);font-size:14px}",
    "#pa-head{padding:12px 16px;background:var(--primary-color,#A31F34);color:var(--background-color,#fff);font-weight:600;display:flex;justify-content:space-between;align-items:center}",
    "#pa-head small{opacity:.8;font-weight:400}",
    "#pa-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}",
    ".pa-msg{max-width:85%;padding:8px 12px;border-radius:10px;line-height:1.55;word-break:break-word;white-space:pre-wrap}",
    ".pa-me{align-self:flex-end;background:var(--primary-color,#A31F34);color:var(--background-color,#fff)}",
    ".pa-ai{align-self:flex-start;background:rgba(128,128,128,.14)}",
    ".pa-ai a{color:var(--primary-color,#A31F34)}",
    ".pa-ai code{background:rgba(128,128,128,.2);padding:1px 5px;border-radius:4px;font-size:12.5px}",
    ".pa-ai pre{background:rgba(0,0,0,.25);padding:8px 10px;border-radius:8px;overflow-x:auto;font-size:12.5px;line-height:1.5}",
    "#pa-form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(128,128,128,.2)}",
    "#pa-input{flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(128,128,128,.35);",
    "background:transparent;color:inherit;outline:none}",
    "#pa-send{padding:8px 14px;border-radius:8px;border:none;background:var(--primary-color,#A31F34);color:var(--background-color,#fff);cursor:pointer}",
    "#pa-send:disabled{opacity:.5;cursor:wait}"
  ].join("");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* 创建按钮，注入到主题 side-tools 容器中 */
  var fab = document.createElement("button");
  fab.id = "pa-fab";
  fab.className = "right-bottom-tools";
  fab.title = "问问博主的数字分身";
  fab.innerHTML = "\uD83D\uDCAC";

  var box = document.createElement("div");
  box.id = "pa-box";
  box.innerHTML =
    '<div id="pa-head"><span>博主数字分身</span><small>由个人 Agent 驱动</small></div>' +
    '<div id="pa-log"></div>' +
    '<form id="pa-form"><input id="pa-input" placeholder="问我博客里的任何话题…" maxlength="500" autocomplete="off"/>' +
    '<button id="pa-send" type="submit">发送</button></form>';

  function mount() {
    var container = document.querySelector(".side-tools-container");
    if (container) {
      container.insertBefore(fab, container.firstChild);
    } else {
      /* 主题容器还没渲染，用 fixed 兜底 */
      fab.style.position = "fixed";
      fab.style.right = "24px";
      fab.style.bottom = "24px";
      fab.style.zIndex = "9998";
      document.body.appendChild(fab);
    }
    document.body.appendChild(box);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(mount, 300); });
  } else {
    setTimeout(mount, 300);
  }

  var log, input, send;
  function initRefs() {
    log = box.querySelector("#pa-log");
    input = box.querySelector("#pa-input");
    send = box.querySelector("#pa-send");
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function md(s) {
    s = esc(s);
    s = s.replace(/```\w*\n?([\s\S]*?)```/g, function (m, c) { return "<pre>" + c + "</pre>"; });
    s = s.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/^#{1,4} (.*)$/gm, "<strong>$1</strong>");
    s = s.replace(/^\s*[-*] (.*)$/gm, "&nbsp;\u2022 $1");
    s = s.replace(/^---+$/gm, "<hr>");
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  function add(kind, text) {
    var d = document.createElement("div");
    d.className = "pa-msg " + (kind === "me" ? "pa-me" : "pa-ai");
    if (kind === "me") { d.textContent = text; } else { d.innerHTML = md(text); }
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  var greeted = false;
  fab.addEventListener("click", function () {
    initRefs();
    var open = box.style.display === "flex";
    box.style.display = open ? "none" : "flex";
    if (!open && !greeted) {
      greeted = true;
      add("ai", "你好，我是博主哈撒的数字分身，背后是他自研的个人 Agent + 知识库。可以问我：LLM 架构、AI Agent 工程、行业观察、经典工程智慧，或任何博客里聊过的话题。");
    }
    if (!open) input.focus();
  });

  box.addEventListener("submit", function (e) {
    if (e.target.id !== "pa-form") return;
    e.preventDefault();
    initRefs();
    var q = input.value.trim();
    if (!q || send.disabled) return;
    add("me", q);
    input.value = "";
    send.disabled = true;
    var bubble = add("ai", "\u2026");
    var acc = "";

    function finish(text) {
      bubble.innerHTML = md(text || acc || "出了点问题，稍后再试。");
      send.disabled = false;
      log.scrollTop = log.scrollHeight;
    }
    function offline() {
      bubble.textContent = "分身暂时不在线（博主的本机 Agent 没开机）。可以先逛逛文章，稍后再来聊。";
      send.disabled = false;
    }

    fetch(API + "/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, session: SID })
    }).then(function (r) {
      if (!r.ok || !r.body) throw new Error("no-stream");
      var reader = r.body.getReader();
      var dec = new TextDecoder();
      var buf = "";
      function pump() {
        return reader.read().then(function (x) {
          if (x.done) { finish(acc); return; }
          buf += dec.decode(x.value, { stream: true });
          var frames = buf.split("\n\n");
          buf = frames.pop();
          frames.forEach(function (f) {
            var line = f.split("\n").filter(function (l) { return l.indexOf("data: ") === 0; })[0];
            if (!line) return;
            try {
              var d = JSON.parse(line.slice(6));
              if (d.delta) { acc += d.delta; bubble.innerHTML = md(acc); log.scrollTop = log.scrollHeight; }
              if (d.status && !acc) { bubble.textContent = d.status; }
              if (d.error) { acc = ""; bubble.textContent = d.error; }
              if (d.done) { finish(d.reply || acc); }
            } catch (err) { /* 忽略半帧 */ }
          });
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, session: SID })
      }).then(function (r) { return r.json(); }).then(function (d) {
        finish(d.reply || d.error);
      }).catch(offline);
    });
  });
})();

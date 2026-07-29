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
    "#pa-fab{position:fixed;right:24px;bottom:24px;width:52px;height:52px;border-radius:50%;",
    "background:#A31F34;color:#fff;border:none;cursor:pointer;z-index:9998;font-size:22px;",
    "box-shadow:0 4px 16px rgba(0,0,0,.25);transition:transform .2s}",
    "#pa-fab:hover{transform:scale(1.08)}",
    "#pa-box{position:fixed;right:24px;bottom:88px;width:min(360px,calc(100vw - 48px));height:480px;",
    "background:var(--background-color,#fff);color:var(--default-text-color,#222);border-radius:14px;",
    "box-shadow:0 8px 40px rgba(0,0,0,.3);z-index:9999;display:none;flex-direction:column;overflow:hidden;",
    "border:1px solid rgba(128,128,128,.25);font-size:14px}",
    "#pa-head{padding:12px 16px;background:#A31F34;color:#fff;font-weight:600;display:flex;justify-content:space-between;align-items:center}",
    "#pa-head small{opacity:.8;font-weight:400}",
    "#pa-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}",
    ".pa-msg{max-width:85%;padding:8px 12px;border-radius:10px;line-height:1.55;word-break:break-word;white-space:pre-wrap}",
    ".pa-me{align-self:flex-end;background:#A31F34;color:#fff}",
    ".pa-ai{align-self:flex-start;background:rgba(128,128,128,.14)}",
    ".pa-ai a{color:#A31F34}",
    "#pa-form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(128,128,128,.2)}",
    "#pa-input{flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(128,128,128,.35);",
    "background:transparent;color:inherit;outline:none}",
    "#pa-send{padding:8px 14px;border-radius:8px;border:none;background:#A31F34;color:#fff;cursor:pointer}",
    "#pa-send:disabled{opacity:.5;cursor:wait}"
  ].join("");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var fab = document.createElement("button");
  fab.id = "pa-fab"; fab.title = "问问博主的数字分身"; fab.textContent = "\uD83D\uDCAC";
  var box = document.createElement("div");
  box.id = "pa-box";
  box.innerHTML =
    '<div id="pa-head"><span>博主数字分身</span><small>由个人 Agent 驱动</small></div>' +
    '<div id="pa-log"></div>' +
    '<form id="pa-form"><input id="pa-input" placeholder="问我博客里的任何话题…" maxlength="500" autocomplete="off"/>' +
    '<button id="pa-send" type="submit">发送</button></form>';
  document.body.appendChild(fab);
  document.body.appendChild(box);

  var log = box.querySelector("#pa-log");
  var input = box.querySelector("#pa-input");
  var send = box.querySelector("#pa-send");

  function add(kind, text) {
    var d = document.createElement("div");
    d.className = "pa-msg " + (kind === "me" ? "pa-me" : "pa-ai");
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  var greeted = false;
  fab.addEventListener("click", function () {
    var open = box.style.display === "flex";
    box.style.display = open ? "none" : "flex";
    if (!open && !greeted) {
      greeted = true;
      add("ai", "你好，我是博主哈撒的数字分身，背后是他自研的个人 Agent + 知识库。可以问我：LLM 架构、AI Agent 工程、行业观察、经典工程智慧，或任何博客里聊过的话题。");
    }
    if (!open) input.focus();
  });

  box.querySelector("#pa-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q || send.disabled) return;
    add("me", q);
    input.value = "";
    send.disabled = true;
    var thinking = add("ai", "思考中…");
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, session: SID })
    }).then(function (r) { return r.json(); }).then(function (d) {
      thinking.textContent = d.reply || d.error || "出了点问题，稍后再试。";
    }).catch(function () {
      thinking.textContent = "分身暂时不在线（博主的本机 Agent 没开机）。可以先逛逛文章，稍后再来聊。";
    }).finally(function () {
      send.disabled = false;
      log.scrollTop = log.scrollHeight;
    });
  });
})();

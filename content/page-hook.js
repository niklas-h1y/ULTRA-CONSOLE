(() => {
  if (window.__ULTRA_CONSOLE_HOOK__) return;
  window.__ULTRA_CONSOLE_HOOK__ = true;
  const send = (type, data) => window.postMessage({ __ultraConsole: true, type, data }, "*");
  const clean = (value, depth = 0) => {
    if (value === null || ["string","number","boolean"].includes(typeof value)) return value;
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "bigint") return value.toString() + "n";
    if (typeof value === "function") return "[Function " + (value.name || "anonymous") + "]";
    if (value instanceof Error) return {name:value.name,message:value.message,stack:value.stack};
    if (depth > 3) return Object.prototype.toString.call(value);
    if (Array.isArray(value)) return value.slice(0,100).map(v=>clean(v,depth+1));
    if (typeof value === "object") {
      const out = {};
      try { Object.keys(value).slice(0,100).forEach(k=>{try{out[k]=clean(value[k],depth+1)}catch{out[k]="[Getter error]"}}); }
      catch { return String(value); }
      return out;
    }
    return String(value);
  };
  ["log","info","warn","error","debug","table","dir","trace"].forEach(level => {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      try { send("log", {level,args:args.map(v=>clean(v)),time:Date.now()}); } catch {}
      original(...args);
    };
  });
  window.addEventListener("error", e => send("log",{level:"error",args:[e.message,e.filename+":"+e.lineno+":"+e.colno],time:Date.now()}));
  window.addEventListener("unhandledrejection", e => send("log",{level:"error",args:["Unhandled promise rejection",clean(e.reason)],time:Date.now()}));
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random());
    const started = performance.now(), input = args[0], init = args[1] || {};
    const url = typeof input === "string" ? input : input?.url || String(input);
    const method = init.method || input?.method || "GET";
    send("network",{id,phase:"start",url,method,kind:"fetch",time:Date.now(),requestHeaders:clean(init.headers),body:clean(init.body)});
    try {
      const response = await originalFetch.apply(this,args);
      const duration = Math.round(performance.now()-started);
      let body = "";
      try { body = (await response.clone().text()).slice(0,20000); } catch {}
      send("network",{id,phase:"end",status:response.status,statusText:response.statusText,ok:response.ok,duration,responseHeaders:Array.from(response.headers.entries()),responseBody:body});
      return response;
    } catch(error) {
      send("network",{id,phase:"error",error:String(error),duration:Math.round(performance.now()-started)});
      throw error;
    }
  };
  const xhrOpen = XMLHttpRequest.prototype.open, xhrSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method,url,...rest) { this.__uc = {id:String(Date.now()+Math.random()),method,url}; return xhrOpen.call(this,method,url,...rest); };
  XMLHttpRequest.prototype.send = function(body) {
    const x=this, meta=x.__uc || {id:String(Date.now()),method:"GET",url:""};
    const started=performance.now();
    send("network",{...meta,phase:"start",kind:"xhr",time:Date.now(),body:clean(body)});
    x.addEventListener("loadend",()=>send("network",{id:meta.id,phase:"end",status:x.status,statusText:x.statusText,duration:Math.round(performance.now()-started),responseBody:typeof x.responseText==="string"?x.responseText.slice(0,20000):"[non-text response]"}),{once:true});
    return xhrSend.call(this,body);
  };
  window.addEventListener("message", async e => {
    if (e.source !== window || !e.data || e.data.__ultraConsoleCommand !== true) return;
    const {id,command,action} = e.data;
    try {
      let result;
      if (action === "eval") result = await (0,eval)(command);
      else if (action === "snapshot") result = {url:location.href,title:document.title,html:document.documentElement.outerHTML.slice(0,50000),elements:document.querySelectorAll("*").length};
      else if (action === "domTree") {
        const nodes=[]; let count=0;
        const selectorFor = el => { if(el===document.documentElement)return "html"; if(el.id) return "#"+CSS.escape(el.id); const parts=[]; let n=el; while(n&&n.nodeType===1&&n!==document.documentElement){let part=n.localName;if(n.parentElement){const same=[...n.parentElement.children].filter(x=>x.localName===n.localName);if(same.length>1)part+=":nth-of-type("+(same.indexOf(n)+1)+")"}parts.unshift(part);n=n.parentElement} return "html>"+parts.join(">") };
        const walk=(el,depth)=>{if(!el||nodes.length>=350||depth>9)return;count++;nodes.push({selector:selectorFor(el),depth,label:el.localName+(el.id?"#"+el.id:"")+(el.classList?.length?"."+[...el.classList].slice(0,2).join("."):"")});[...el.children].slice(0,60).forEach(ch=>walk(ch,depth+1))};
        walk(document.documentElement,0); result={nodes,count:document.querySelectorAll("*").length};
      }
      else if (action === "inspectNode") {
        const el=document.querySelector(command); if(!el)throw new Error("Element not found");
        const cs=getComputedStyle(el); result={tag:el.localName,text:(el.textContent||"").trim().slice(0,3000),className:el.className?.toString?.()||"",id:el.id,style:el.getAttribute("style")||"",html:el.outerHTML.slice(0,12000),computed:{display:cs.display,position:cs.position,color:cs.color,fontSize:cs.fontSize}};
      }
      else if (action === "setText" || action === "setAttrs" || action === "setStyle") {
        const p=JSON.parse(command),el=document.querySelector(p.selector);if(!el)throw new Error("Element not found");
        if(action==="setText")el.textContent=String(p.value);
        if(action==="setAttrs"){el.className=String(p.value.className||"");el.id=String(p.value.id||"")}
        if(action==="setStyle")el.setAttribute("style",String(p.value||""));
        result={success:true};
      }
      else if (action === "removeNode") { const el=document.querySelector(command);if(!el)throw new Error("Element not found");if(el===document.documentElement||el===document.body)throw new Error("Refusing to remove the document root");el.remove();result={success:true}; }
      else if (action === "storage") result = {local:{...localStorage},session:{...sessionStorage},cookies:document.cookie};
      else if (action === "scripts") result = Array.from(document.scripts).map(s=>({src:s.src||"[inline]",type:s.type||"text/javascript"}));
      send("result",{id,result:clean(result)});
    } catch(error) { send("result",{id,error:{name:error.name,message:error.message,stack:error.stack}}); }
  });
  send("ready",{url:location.href,title:document.title});
})();
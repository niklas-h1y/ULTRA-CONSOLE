const statusText=document.getElementById("status");
const dot=document.querySelector(".dot");
let activeTab=null;
async function init(){
 const [tab]=await chrome.tabs.query({active:true,currentWindow:true});activeTab=tab;
 const supported=!!tab?.id&&/^https?:/.test(tab.url||"");
 statusText.textContent=supported?"Ready on this page":"This page cannot be inspected";
 dot.classList.toggle("ready",supported);
 document.getElementById("open").disabled=!supported;
 document.getElementById("open").style.opacity=supported?"1":".45";
}
document.getElementById("open").addEventListener("click",async()=>{
 if(!activeTab?.id)return;
 try{await chrome.tabs.sendMessage(activeTab.id,{type:"ULTRA_TOGGLE"});window.close();}
 catch{statusText.textContent="Reload this page, then try again";}
});
document.getElementById("devtools").addEventListener("click",()=>{
 statusText.textContent="Press F12 or Ctrl+Shift+I, then select ULTRA-CONSOLE";
});
init();
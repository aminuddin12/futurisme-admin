const t=(t,o)=>{try{if("function"!=typeof window.route)return o;const n=window.route();if(n&&"function"==typeof n.has&&n.has(t))return window.route(t)}catch(n){}return o};export{t as s};

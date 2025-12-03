const n=(o,e)=>{try{if(typeof window.route!="function")return e;const t=window.route();if(t&&typeof t.has=="function"&&t.has(o))return window.route(o)}catch{}return e};export{n as s};

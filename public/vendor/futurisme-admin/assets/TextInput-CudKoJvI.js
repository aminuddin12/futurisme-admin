import{j as u,r as n}from"./vendor-react-mIUCV8oU.js";function d({className:o="",disabled:t,children:e,...r}){return u.jsx("button",{...r,className:`
                inline-flex items-center justify-center 
                px-4 py-3 w-full 
                bg-indigo-600 border border-transparent rounded-lg 
                font-semibold text-xs text-white uppercase tracking-widest 
                hover:bg-indigo-700 active:bg-indigo-900 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                transition ease-in-out duration-150 
                shadow-lg 
                ${t?"opacity-25":""}
                ${o}
            `,disabled:t,children:e})}const g=n.forwardRef(function({type:t="text",className:e="",isFocused:r=!1,...a},f){const i=n.useRef(null);return n.useEffect(()=>{var s;r&&((s=i.current)==null||s.focus())},[]),u.jsx("input",{...a,type:t,className:`
                border-gray-300 text-gray-900 rounded-lg shadow-sm 
                w-full transition-all duration-200 
                focus:border-indigo-500 focus:ring-indigo-500 
                py-[0.6rem] 
                ${e}
            `,ref:i})});export{d as P,g as T};

import{j as i,r as o}from"./vendor-react-BJou1wpF.js";function l({message:e,className:t="",...r}){return e?i.jsx("p",{...r,className:`
                text-sm text-red-600 mt-1 animate-pulse 
                ${t}
            `,children:e}):null}function d({className:e="",disabled:t,children:r,...n}){return i.jsx("button",{...n,className:`
                inline-flex items-center justify-center 
                px-4 py-3 w-full 
                bg-indigo-600 border border-transparent rounded-lg 
                font-semibold text-xs text-white uppercase tracking-widest 
                hover:bg-indigo-700 active:bg-indigo-900 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                transition ease-in-out duration-150 
                shadow-lg 
                ${t?"opacity-25":""}
                ${e}
            `,disabled:t,children:r})}const g=o.forwardRef(function({type:t="text",className:r="",isFocused:n=!1,...a},f){const s=o.useRef(null);return o.useEffect(()=>{var u;n&&((u=s.current)==null||u.focus())},[]),i.jsx("input",{...a,type:t,className:`
                border-gray-300 text-gray-900 rounded-lg shadow-sm 
                w-full transition-all duration-200 
                focus:border-indigo-500 focus:ring-indigo-500 
                py-[0.6rem] 
                ${r}
            `,ref:s})});export{l as I,d as P,g as T};

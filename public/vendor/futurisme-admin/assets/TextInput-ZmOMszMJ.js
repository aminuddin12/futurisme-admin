import{j as n,r as s}from"./app-D4Jw5Hj3.js";function c({message:t,className:e="",...r}){return t?n.jsx("p",{...r,className:`
                text-sm text-red-600 mt-1 animate-pulse 
                ${e}
            `,children:t}):null}function f({className:t="",disabled:e,children:r,...o}){return n.jsx("button",{...o,className:`
                inline-flex items-center justify-center 
                px-4 py-3 w-full 
                bg-indigo-600 border border-transparent rounded-lg 
                font-semibold text-xs text-white uppercase tracking-widest 
                hover:bg-indigo-700 active:bg-indigo-900 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                transition ease-in-out duration-150 
                shadow-lg 
                ${e?"opacity-25":""}
                ${t}
            `,disabled:e,children:r})}const x=s.forwardRef(function({type:e="text",className:r="",isFocused:o=!1,...d},l){const i=s.useRef(null);return s.useEffect(()=>{var a;o&&((a=i.current)==null||a.focus())},[]),n.jsx("input",{...d,type:e,className:`
                w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm 
                placeholder:text-slate-400 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none
                disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
                
                dark:border-slate-700 dark:bg-slate-900 dark:text-white 
                dark:placeholder:text-slate-500 
                dark:focus:border-indigo-400 dark:focus:ring-indigo-400
                dark:disabled:bg-slate-800 dark:disabled:text-slate-400

                transition-all duration-200 ease-in-out
                ${r}
            `,ref:i})});export{c as I,f as P,x as T};

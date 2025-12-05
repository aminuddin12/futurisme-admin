import { forwardRef, useEffect, useRef, InputHTMLAttributes } from "react";

export default forwardRef(function TextInput(
  {
    type = "text",
    className = "",
    isFocused = false,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
  ref
) {
  const localRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, []);

  return (
    <input
      {...props}
      type={type}
      className={`
                w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm 
                placeholder:text-slate-400 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none
                disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
                
                dark:border-slate-700 dark:bg-slate-900 dark:text-white 
                dark:placeholder:text-slate-500 
                dark:focus:border-indigo-400 dark:focus:ring-indigo-400
                dark:disabled:bg-slate-800 dark:disabled:text-slate-400

                transition-all duration-200 ease-in-out
                ${className}
            `}
      ref={localRef}
    />
  );
});

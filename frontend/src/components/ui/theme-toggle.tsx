import React from 'react';

export function ThemeToggle(){
  const toggle = () => {
    const el = document.documentElement;
    if (el.classList.contains('dark')){
      el.classList.remove('dark');
      localStorage.setItem('theme','light');
    } else {
      el.classList.add('dark');
      localStorage.setItem('theme','dark');
    }
  }

  React.useEffect(()=>{
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },[]);

  return (
    <button onClick={toggle} className="rounded-md border px-3 py-1 text-sm">Toggle Theme</button>
  );
}

export default ThemeToggle;
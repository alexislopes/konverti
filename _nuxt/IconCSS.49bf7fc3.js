import{d as l,X as _,Y as d,c as o,k as m,l as f,Z as S,_ as x}from"./entry.fb71ef90.js";const g=l({__name:"IconCSS",props:{name:{type:String,required:!0},size:{type:String,default:""}},setup(r){const n=r;_(e=>({"28e0b506":u.value}));const s=d(),p=o(()=>{var e;return((((e=s.nuxtIcon)==null?void 0:e.aliases)||{})[n.name]||n.name).replace(/^i-/,"")}),u=o(()=>`url('https://api.iconify.design/${p.value.replace(":","/")}.svg')`),c=o(()=>{var t,a,i;if(!n.size&&typeof((t=s.nuxtIcon)==null?void 0:t.size)=="boolean"&&!((a=s.nuxtIcon)!=null&&a.size))return;const e=n.size||((i=s.nuxtIcon)==null?void 0:i.size)||"1em";return String(Number(e))===e?`${e}px`:e});return(e,t)=>(m(),f("span",{style:S({width:c.value,height:c.value})},null,4))}});const z=x(g,[["__scopeId","data-v-dec2cdb4"]]);export{z as default};

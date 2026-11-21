// Safar Kitobi belgisi: ochiq kitob + 39° kenglik chizig'i + yulduz (kenglik stansiyasiga ishora)
export default function Logo({ size = 36 }){
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="rgb(var(--firuza))" />
      <path d="M10 15c5-2 10-1 14 2v18c-4-3-9-4-14-2z" fill="rgb(var(--varaq))" />
      <path d="M38 15c-5-2-10-1-14 2v18c4-3 9-4 14-2z" fill="rgb(var(--varaq))" opacity=".85" />
      <path d="M8 27h32" stroke="rgb(var(--oltin))" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M24 7l1.6 3.4 3.7.4-2.8 2.5.8 3.6L24 15.1l-3.3 1.8.8-3.6-2.8-2.5 3.7-.4z" fill="rgb(var(--oltin))" />
    </svg>
  )
}

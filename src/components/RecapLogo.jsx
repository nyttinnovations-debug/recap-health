export default function RecapLogo({ size = 40, showText = true }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <img
        src="/logo1.png"
        alt="RECAP"
        style={{ width:size, height:size, objectFit:'contain' }}
        onError={e => {
          e.target.style.display = 'none'
          const d = document.createElement('div')
          d.style.cssText = 'width:'+size+'px;height:'+size+'px;borderRadius:8px;background:linear-gradient(135deg,#1A73E8,#0D9488);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-family:Syne,sans-serif;font-size:'+(size*0.42)+'px'
          d.textContent = 'R'
          e.target.parentNode.appendChild(d)
        }}
      />
      {showText && (
        <div>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:900, fontSize:size*0.38, color:'#111827', letterSpacing:'-0.03em', lineHeight:1 }}>RECAP</div>
          <div style={{ fontSize:size*0.17, color:'#6B7280', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:1 }}>Recovery Intelligence</div>
        </div>
      )}
    </div>
  )
}

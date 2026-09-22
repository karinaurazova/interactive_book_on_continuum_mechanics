import type { Language } from '../i18n'

type Props = {
  language: Language
  items: { ru: string; en: string }[]
}

export function ApplicationLinks({language,items}:Props){
  const title=language==='ru'?'Где это понадобится':'Where this is used'
  const note=language==='ru'
    ?'Один и тот же аппарат МСС связывает разные классы сред и прикладные задачи.'
    :'The same continuum-mechanics framework connects different media and applications.'

  return (
    <div className="application-links">
      <div className="application-links-head">
        <span>{title}</span>
        <p>{note}</p>
      </div>
      <div className="application-links-list">
        {items.map((item,i)=><span key={i}>{item[language]}</span>)}
      </div>
    </div>
  )
}

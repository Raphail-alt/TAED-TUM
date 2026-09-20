const dateFmt = new Intl.DateTimeFormat('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
const timeFmt = new Intl.DateTimeFormat('en-KE', { hour: 'numeric', minute: '2-digit', hour12: true })
const fullFmt = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDate = (iso) => dateFmt.format(new Date(iso))
export const formatTime = (iso) => timeFmt.format(new Date(iso))
export const formatFullDate = (iso) => fullFmt.format(new Date(iso))

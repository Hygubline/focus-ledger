export type SessionType = "deep" | "gaming";
export const CATEGORIES = ["HVAC", "Programming", "Reading", "Marketing", "Other"] as const;
export type Session = { id: string; type: SessionType; startTime: number; endTime: number; durationSeconds: number; category?: string; note?: string };

export function resolveSessionDurationSeconds({
  mode,
  startTime,
  endTime,
  trackedDurationSeconds,
  originalStartTime,
  originalEndTime,
}: {
  mode: "timer" | "manual" | "edit";
  startTime: number;
  endTime: number;
  trackedDurationSeconds?: number | null;
  originalStartTime?: number | null;
  originalEndTime?: number | null;
}) {
  if (mode === "timer" && trackedDurationSeconds != null) {
    return Math.max(0, Math.round(trackedDurationSeconds));
  }
  if (
    mode === "edit" &&
    trackedDurationSeconds != null &&
    startTime === originalStartTime &&
    endTime === originalEndTime
  ) {
    return Math.max(0, Math.round(trackedDurationSeconds));
  }
  return Math.max(0, Math.round((endTime - startTime) / 1000));
}

export function getWeekStart(input: number | Date) { const d = new Date(input); d.setHours(0,0,0,0); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d; }
export function formatDuration(seconds: number, clock = false) { const s=Math.max(0,Math.floor(seconds)); const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60; if(clock) return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; if(h && m) return `${h}h ${m}m`; if(h) return `${h}h`; return `${m}m`; }
const sum=(items:Session[],type:SessionType)=>items.filter(s=>s.type===type).reduce((a,s)=>a+s.durationSeconds,0);
const change=(current:number,previous:number)=> previous===0 ? (current===0?"No change vs last week":"New vs last week") : `${current>=previous?"↑":"↓"} ${Math.round(Math.abs(current-previous)/previous*100)}% vs last week`;

export function calculateStats(sessions: Session[], nowMs=Date.now(), goalHours=15) {
  const now=new Date(nowMs), todayStart=new Date(now); todayStart.setHours(0,0,0,0); const weekStart=getWeekStart(now); const nextWeek=new Date(weekStart); nextWeek.setDate(nextWeek.getDate()+7); const prevStart=new Date(weekStart); prevStart.setDate(prevStart.getDate()-7);
  const inRange=(a:Date,b:Date)=>sessions.filter(s=>s.startTime>=a.getTime()&&s.startTime<b.getTime());
  const todaySessions=inRange(todayStart,new Date(todayStart.getTime()+86400000)), weekSessions=inRange(weekStart,nextWeek), prevSessions=inRange(prevStart,weekStart);
  const deep=sum(weekSessions,"deep"), gaming=sum(weekSessions,"gaming");
  const daily=Array.from({length:7},(_,i)=>{const a=new Date(weekStart);a.setDate(a.getDate()+i);const b=new Date(a);b.setDate(b.getDate()+1);const items=inRange(a,b);return{label:a.toLocaleDateString("en-US",{weekday:"short"}).slice(0,2),deep:sum(items,"deep"),gaming:sum(items,"gaming")}});
  const categories=CATEGORIES.map(name=>({name,seconds:weekSessions.filter(s=>s.type==="deep"&&s.category===name).reduce((a,s)=>a+s.durationSeconds,0)})).filter(c=>c.seconds>0).sort((a,b)=>b.seconds-a.seconds).map(c=>({...c,percent:deep?c.seconds/deep*100:0}));
  const trend=Array.from({length:8},(_,i)=>{const a=new Date(weekStart);a.setDate(a.getDate()-(7*(7-i)));const b=new Date(a);b.setDate(b.getDate()+7);const items=inRange(a,b);return{label:a.toLocaleDateString("en-US",{month:"short",day:"numeric"}),deep:sum(items,"deep"),gaming:sum(items,"gaming")}});
  const strongest=daily.reduce((best,d)=>d.deep>best.seconds?{label:d.label,seconds:d.deep}:best,{label:"—",seconds:0});
  return {today:{deep:sum(todaySessions,"deep"),gaming:sum(todaySessions,"gaming")},week:{deep,gaming,focusedDays:daily.filter(d=>d.deep>=3600).length,ratio:gaming?`${(deep/gaming).toFixed(1)}×`:deep?"∞":"—",goalProgress:Math.min(100,deep/(goalHours*3600)*100)},daily,dailyMax:Math.max(1,...daily.flatMap(d=>[d.deep,d.gaming])),categories,trend,trendMax:Math.max(1,...trend.flatMap(w=>[w.deep,w.gaming])),strongest,comparison:{deep:change(deep,sum(prevSessions,"deep")),gaming:change(gaming,sum(prevSessions,"gaming"))}};
}

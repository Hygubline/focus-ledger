import assert from "node:assert/strict";
import { calculateStats, formatDuration, getWeekStart, type Session } from "./ledger.ts";
const at=(day:number,hour=9)=>new Date(2026,8,day,hour).getTime();
const sessions:Session[]=[
 {id:"a",type:"deep",startTime:at(14),endTime:at(14,11),durationSeconds:7200,category:"Programming"},
 {id:"b",type:"gaming",startTime:at(14,20),endTime:at(14,21),durationSeconds:3600},
 {id:"c",type:"deep",startTime:at(15),endTime:at(15,9)+1800000,durationSeconds:1800,category:"Reading"},
 {id:"d",type:"deep",startTime:at(7),endTime:at(7,10),durationSeconds:3600,category:"HVAC"},
];
const stats=calculateStats(sessions,at(16,12),10);
assert.equal(getWeekStart(at(16)).getDate(),14);
assert.equal(stats.week.deep,9000);
assert.equal(stats.week.gaming,3600);
assert.equal(stats.week.focusedDays,1);
assert.equal(stats.week.ratio,"2.5×");
assert.equal(stats.week.goalProgress,25);
assert.equal(stats.strongest.seconds,7200);
assert.equal(stats.categories[0].name,"Programming");
assert.equal(stats.comparison.deep,"↑ 150% vs last week");
assert.equal(formatDuration(7265),"2h 1m");
assert.equal(formatDuration(65,true),"00:01:05");
console.log("ledger calculations: ok");

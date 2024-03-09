export function formatTime(time: number) {
    if(time < 1000) return `${time}ms`
    if(time < 60000) return `${(time/1000).toFixed(2)}sec`
    if(time < 3600000) return `${Math.floor(time/60000)}min-${((time%60000)/1000).toFixed(2)}sec`;
    return `${Math.floor(time/3600000)}h-${Math.floor((time%3600000)/60000)}min-${((time%60000)/1000).toFixed(2)}sec`;
}
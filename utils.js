function relativeTime(current, previous) {

  let msTenSeconds = 10 * 1000
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msTenSeconds) {
    return 'agora';  
  }

  if (elapsed < msPerMinute) {
      return 'h&#225; ' + Math.round(elapsed/1000) + ' segundos';   
  }

  else if (elapsed < msPerHour) {
      return 'h&#225; ' + Math.round(elapsed/msPerMinute) + ' minutos';   
  }

  else if (elapsed < msPerDay ) {
      return 'h&#225; ' + Math.round(elapsed/msPerHour ) + ' horas';   
  }

  else if (elapsed < msPerMonth) {
    return 'h&#225; ' + Math.round(elapsed/msPerDay) + ' dias';   
  }

  else if (elapsed < msPerYear) {
    return 'h&#225; ' + Math.round(elapsed/msPerMonth) + ' meses';   
  }

  else {
    return 'h&#225; ' + Math.round(elapsed/msPerYear ) + ' anos';   
  }
}
  
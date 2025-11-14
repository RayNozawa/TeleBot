export const run = {
   usage: ['claim'],
   hidden: ['klaim','harian','daily','mingguan','weekly','bulanan','monthly'],
   category: 'user',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env,
      Func,
      bot,
      isOwnerBot,
      Scraper
   }) => {
    let now = new Date().getTime();
    let message = '✅ *Klaim Berhasil!*\n\nKamu mendapatkan:\n';
    let claimed = [];
    let pending = [];

    users.lastdaily = users.lastdaily || 0;
    users.lastweekly = users.lastweekly || 0;
    users.lastmonthly = users.lastmonthly || 0;

    function formatWaktu(ms) {
        let seconds = Math.floor(ms / 1000) % 60;
        let minutes = Math.floor(ms / (1000 * 60)) % 60;
        let hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
        let days = Math.floor(ms / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} hari ${hours} jam lagi`;
        if (hours > 0) return `${hours} jam ${minutes} menit lagi`;
        if (minutes > 0) return `${minutes} menit ${seconds} detik lagi`;
        return `${seconds} detik lagi`;
    }

    let nextDaily = users.lastdaily + 86400000;
    if (now - users.lastdaily >= 86400000) {
        users.exp = (users.exp || 0) + 1000;
        users.limit = (users.limit || 0) + 10;
        users.lastdaily = now;
        claimed.push('🌞 *Harian*: +1000 Exp, +10 Limit');
    } else {
        pending.push(`🌞 *Harian*: ${formatWaktu(nextDaily - now)}`);
    }

    let nextWeekly = users.lastweekly + 604800000;
    if (now - users.lastweekly >= 604800000) {
        users.exp = (users.exp || 0) + 2000;
        users.limit = (users.limit || 0) + 20;
        users.lastweekly = now;
        claimed.push('📅 *Mingguan*: +2000 Exp, +20 Limit');
    } else {
        pending.push(`📅 *Mingguan*: ${formatWaktu(nextWeekly - now)}`);
    }

    let nextMonthly = users.lastmonthly + 2592000000;
    if (now - users.lastmonthly >= 2592000000) {
        users.exp = (users.exp || 0) + 3000;
        users.limit = (users.limit || 0) + 30;
        users.lastmonthly = now;
        claimed.push('🌕 *Bulanan*: +3000 Exp, +30 Limit');
    } else {
        pending.push(`🌕 *Bulanan*: ${formatWaktu(nextMonthly - now)}`);
    }

    if (claimed.length > 0) {
        message += claimed.join('\n') + '\n\n';
    } else {
        message = '⚠️ Kamu sudah mengambil semua klaim yang tersedia!\n\n';
    }

    if (pending.length > 0) {
        message += '⏳ *Waktu yang dibutuhkan untuk klaim selanjutnya:*\n' + pending.join('\n');
    }

    m.reply(message);
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    monthly = Math.floor((duration / (1000 * 60 * 60 * 24)) % 720)

  monthly  = (monthly < 10) ? "0" + monthly : monthly
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return monthly + " Hari " +  hours + " Jam " + minutes + " Menit"
}
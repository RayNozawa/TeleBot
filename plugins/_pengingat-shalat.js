export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner, bot}) => {

    conn.autosholat = conn.autosholat || {};
    let id = m.chat;

    let jadwalSholat = {
        Jakarta: {
            Fajar: "04:49",
            Sunrise: "06:04",
            Dhuhr: "12:06",
            Asr: "15:21",
            Sunset: "18:08",
            Maghrib: "18:08",
            Isha: "19:38",
            Imsak: "04:39",
            Midnight: "00:06",
            Firstthird: "22:07",
            Lastthird: "02:06"
        },
        Medan: {
            Fajar: "05:22",
            Dhuhr: "12:40",
            Asr: "15:57",
            Maghrib: "18:41",
            Isha: "19:51"
        }
    };

    const timeZone = "Asia/Jakarta"; // Bisa diubah jika ada perbedaan zona waktu
    const date = new Date(new Date().toLocaleString("en-US", { timeZone }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    if (conn.autosholat[id] === timeNow) return false; 

    let wilayahTerpilih = null;
    let sholatTerpilih = null;

    for (const [wilayah, jadwal] of Object.entries(jadwalSholat)) {
        for (const [sholat, waktu] of Object.entries(jadwal)) {
            if (timeNow === waktu) {
                wilayahTerpilih = wilayah;
                sholatTerpilih = sholat;
                break;
            }
        }
        if (wilayahTerpilih) break;
    }

    if (wilayahTerpilih && sholatTerpilih) {
        let caption = `Hei ${await getName(m.sender, conn)}!,\nWaktu *${sholatTerpilih}* telah tiba, ambilah air wudhu dan segeralah shalat.\n\n*${timeNow}*\n_untuk wilayah ${wilayahTerpilih} dan sekitarnya._`;
        m.reply(caption)

        conn.autosholat[id] = timeNow;

        setTimeout(() => {
            delete conn.autosholat[id];
        }, 120000);
    }
   },
   error: false,
   cache: true,
   location: __filename
};
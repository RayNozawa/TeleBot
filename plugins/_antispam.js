export const run = {
   async: async (m, { conn, users, groupSet }) => {   
    if (!m.text) return;

    conn.spam = conn.spam || {};

    const now = Math.floor(Date.now() / 1000);
    const spamLimit = 5 * 60;

    if (m.sender in conn.spam) {
        conn.spam[m.sender].count++;

        if (now - conn.spam[m.sender].lastspam > 3) {
            if (conn.spam[m.sender].count > 3) {
                if (now - conn.spam[m.sender].lastvn >= spamLimit) {
                    m.reply("Jangan spam!")
                    conn.spam[m.sender].lastvn = now;
                }
            }
            conn.spam[m.sender].count = 0;
            conn.spam[m.sender].lastspam = now;
        }
    } else {
        conn.spam[m.sender] = {
            jid: m.sender,
            count: 0,
            lastspam: 0,
            lastvn: 0,
        };
    }
   },
   error: false,
   cache: true,
   location: __filename
};
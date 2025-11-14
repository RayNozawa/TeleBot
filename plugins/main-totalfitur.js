export const run = {
  usage: ["totalfitur"],
  category: "main",
  async: async (m, { conn, text }) => {
    let totalFitur = 0;
    let semuaUsage = [];
    
    for (const key in global.plugins) {
      const run = global.plugins[key].run;
      if (run && Array.isArray(run.usage)) {
        totalFitur += run.usage.length;
        semuaUsage.push(...run.usage);
      }
    };
    m.reply(`Bot ini memiliki *${totalFitur}* fitur`)
  },
  error: false,
  restrict: true,
  location: __filename
}
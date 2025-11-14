export const run = {
  usage: ['totalchat'],
  hidden: ['totalpesan'],
  category: 'groups',
  async: async (m, { conn, text, command, isAdmin }) => {
     m.reply(`*Total Chat:* \`${m.id.toLocaleString("id-ID")}\`\n\`!Termasuk pesan yang dihapus\``)
  },
  error: false,
  restrict: true,
  location: __filename
}
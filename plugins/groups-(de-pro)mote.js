export const run = {
  usage: ['promote', 'demote'],
  use: 'reply msg',
  category: 'groups',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    Func,
    env,
    isAdmin
  }) => {
    const bot = await conn.getMe()
    if (!(await isAdmin(bot.id))) return m.reply("Bot bukan admin!")

    try {
      if (command == "promote") {
        if (!m.quoted) return m.reply("Reply pesan member yang mau dijadikan admin!")

        await conn.promoteChatMember(m.chat, m.quoted.sender, {
          can_manage_chat: true,
          can_delete_messages: true,
          can_invite_users: true,
          can_pin_messages: true,
          can_manage_video_chats: true,
          can_restrict_members: true,
          can_promote_members: false,
        });
      } else if (command == "demote") {
        if (!m.quoted) return m.reply("Reply pesan member yang mau di unadmin!")
        await conn.promoteChatMember(m.chat, m.quoted.sender, {
          can_manage_chat: false,
          can_delete_messages: false,
          can_invite_users: false,
          can_pin_messages: false,
          can_manage_video_chats: false,
          can_restrict_members: false,
          can_promote_members: false,
        });
      }
    } catch (e) {
      return m.reply(`Kemungkinan bot tidak punya izin!\n\n${e.message}`)
    }
  },
  error: false,
  restrict: true,
  cache: true,
  admin: true,
  group: true,
  location: __filename
}
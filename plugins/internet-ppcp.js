import fetch from "node-fetch"

export const run = {
    usage: ['ppcp'],
    category: 'internet',
    async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      Func,
      env
    }) => {
      conn.sendChatAction(m.chat, "upload_photo")
      
      let data = await (await fetch('https://raw.githubusercontent.com/ShirokamiRyzen/WAbot-DB/main/fitur_db/ppcp.json')).json()
      let cita = data[Math.floor(Math.random() * data.length)]
      
      const media = [{
          type: 'photo',
          media: cita.cowo,
          caption: 'Cowo'
        },
        {
          type: 'photo',
          media: cita.cewe,
          caption: 'Cewe'
      }]
      await conn.sendMediaGroup(m.chat, media)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}
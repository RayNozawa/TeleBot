import sticker from '../lib/sticker.js';
import axios from "axios"

export const run = {
  usage: ['premium'],
  hidden: ['prem'],
  category: 'main',
  async: async (m, {
    conn,
    command,
    isPrefix,
    env
  }) => {
    const text = `*[Premium]*\nRp5.000 Per Bulan\n\n*[Limit]*\nRp1.000 Per 100 Limit\n\nHubungi: @${env.owner}`
    m.reply(text)
  },
  error: false,
  restrict: true,
  cache: true,
  location: __filename
}
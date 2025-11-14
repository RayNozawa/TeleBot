import { fileTypeFromBuffer } from 'file-type';
import axios from "axios"
import FormData from "form-data";
import crypto from "crypto"

class GridPlus {
  constructor() {
    this.ins = axios.create({
      baseURL: 'https://api.grid.plus/v1',
      headers: {
        'user-agent': 'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0',
        'X-AppID': '808645',
        'X-Platform': 'h5',
        'X-Version': '8.9.7',
        'X-SessionToken': '',
        'X-UniqueID': this.uid(),
        'X-GhostID': this.uid(),
        'X-DeviceID': this.uid(),
        'X-MCC': 'id-ID',
        sig: `XX${this.uid() + this.uid()}`
      }
    });
  }

  uid() {
    return crypto.randomUUID().replace(/-/g, '');
  }

  form(dt) {
    const form = new FormData();
    Object.entries(dt).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    return form;
  }

  async upload(buff, method) {
    if (!Buffer.isBuffer(buff)) throw 'data is not buffer!';
    const { mime, ext } = await fileTypeFromBuffer(buff) || {};
    const d = await this.ins.post('/ai/web/nologin/getuploadurl', this.form({ ext, method })).then(i => i.data);
    await axios.put(d.data.upload_url, buff, { headers: { 'content-type': mime } });
    return d.data.img_url;
  }

  async task({ path, data, sl = () => false }) {
    const [start, interval, timeout] = [Date.now(), 3000, 60000];
    return new Promise((resolve, reject) => {
      const check = async () => {
        if (Date.now() - start > timeout) return reject(new Error(`Polling timed out`));
        try {
          const dt = await this.ins({
            url: path,
            method: data ? 'POST' : 'GET',
            ...(data ? { data } : {})
          });
          if (!!dt.errmsg?.trim()) return reject(new Error(`Error: ${dt.errmsg}`));
          if (!!sl(dt.data)) return resolve(dt.data);
          setTimeout(check, interval);
        } catch (err) {
          reject(err);
        }
      };
      check();
    });
  }

  async edit(buff, prompt) {
    const up = await this.upload(buff, 'wn_aistyle_nano');
    const dn = await this.ins.post('/ai/nano/upload', this.form({ prompt, url: up })).then(i => i.data);
    if (!dn.task_id) throw 'taskId not found';
    const res = await this.task({
      path: `/ai/nano/get_result/${dn.task_id}`,
      sl: (dt) => dt.code === 0 && !!dt.image_url,
    });
    return res.image_url;
  }
}

export const run = {
  usage: ['editimg'],
  use: 'image+prompt',
  category: 'maker',
  async: async (m, {
    conn,
    text,
    isPrefix,
    command,
    env
  }) => {
    let q = m.quoted ? m.quoted : m
    let mime = q.type
    if (!/photo/.test(mime) || !text) return m.reply(`📸 Balas gambar yang mau diedit pake caption prompt-nya!\n\nContoh:\n${isPrefix+command} cyberpunk style`);
    
    conn.sendChatAction(m.chat, "upload_photo")
    const buffer = await q.download()

  const gp = new GridPlus();
  try {
    const resultUrl = await gp.edit(buffer, text);
    await conn.sendButton(m.chat, donateBtn, resultUrl, 'wasted.jpg', "`Successfully generated image!`", m.msg, env.wm);
  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal edit gambar: ' + e.message);
  }
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}
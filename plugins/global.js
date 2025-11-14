import FormData from "form-data";
import fs from "fs";
import { fileTypeFromBuffer } from 'file-type';
import axios from "axios"
import path from "path";

export const run = {
   async: async (m, { conn, Api, body, Func, users, env, isROwner, bot }) => {
   
     if (!bot) bot = {}
     if (!bot?.listgroup) bot.listgroup = []
     
     let arr = bot.listgroup;
     if (m.isGroup && !arr.includes(m.chat)) arr.push(m.chat)
     
     for (const list of arr) {
       try {
         await conn.getChat(list);
       } catch (e) {
         if (e.message == "ETELEGRAM: 400 Bad Request: chat not found") {
           const index = arr.indexOf(list);
           
           if (index !== -1) {
             arr.splice(index, 1);
           }
         }
       }
     }
     
     for (let id in db.anonymous) {
       if (!db.anonymous[id].check) {
         db.anonymous[id].check = function (who = '') {
           return [this.a, this.b].includes(who)
         }
       }
       if (!db.anonymous[id].other) {
         db.anonymous[id].other = function (who = '') {
           return who === this.a ? this.b : who === this.b ? this.a : ''
         }
       }
     }
     
     global.sendAnimatedSticker = async (bot, chatId, buffer) => {
       const fileName = path.join(process.cwd(), `tmp/${Date.now()}.webm`);
       
       fs.writeFileSync(fileName, buffer);
       await bot.sendSticker(chatId, fs.createReadStream(fileName));
       fs.unlinkSync(fileName);
     }
     
     global.getPpUser = async (bot, id) => {
       try {
         let { file_id } = Object.values((await bot.getUserProfilePhotos(id, { limit: 1 })).photos[0]).pop()
         return await bot.getFileLink(file_id)
       } catch (e) {
         return "https://cdn.videy.co/op7Fxgwy1.mp4"
       }
     }
     
     global.getName = async (id) => {
       try {
         const user = await conn.getChat(id)
         return user.username ? '@' + user.username : user.first_name
       } catch (e) {
         console.log(e.message)
         return id
       }
     }
     
     global.uploadHF = async (file) => {
       const formData = new FormData();
       
       const { mime, ext } = await fileTypeFromBuffer(file) || {};
       
       formData.append('file', file, {
         filename: `${Date.now()}.${ext}`,
         contentType: mime
       });
       
       try {
         const response = await axios.post(
           `${hfmain}/cloud`,
           formData,
           { headers: formData.getHeaders() }
         );
         return { message: response.data.message, url: response.data.link }
       } catch (error) {
         console.error("Upload gagal:", error.response?.data || error.message);
       }
     }
     
     global.cd = async (waktu) => {
       return m.reply(`Silahkan coba lagi dalam ${waktu}`)
     }
     
     global.getRandom = (media) => {
       if (Array.isArray(media)) {
         return media[Math.floor(Math.random() * media.length)];
       } else if (typeof media === "number") {
         return Math.floor(Math.random() * media)
       }
     }

   },
   error: false,
   location: __filename
};
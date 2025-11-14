import axios from 'axios'
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import FormData from "form-data"
import { fileTypeFromBuffer } from 'file-type';

export const run = {
   usage: ['deploy'],
   use: 'file',
   category: 'internet',
   async: async (m, {
      conn,
      text,
      isPrefix,
      command,
      users,
      env
   }) => {
     try {
       const VER_TOKEN = "isaBYsc2xQLvr26tLDFeZwbv";
       
       const reply = m.quoted?.msg;
       
       if (!reply || !reply.document) return m.reply("❗ Reply file .html lalu ketik /deploy website-contoh");
       
       if (!text) return m.reply("❗ Contoh: /deploy website-payment-by-ikyy\n\nCommand Wajib Reply Ke file.html");
       
       const sitename = text.replace(/ /g, "-")
       const file = reply.document;
       const link = await conn.getFileLink(file.file_id);
       const ext = path.extname(file.file_name).toLowerCase();
       const filename = "upload_" + Date.now() + ext;
       const filepath = path.join(process.cwd(), 'tmp', filename);
       
       const writer = fs.createWriteStream(filepath);
       const response = await axios.get(link, { responseType: "stream" });
       response.data.pipe(writer);
       await new Promise((resolve, reject) => {
         writer.on("finish", resolve);
         writer.on("error", reject);
       });
       
       const fileList = [];
       if (ext === ".zip") {
         const zip = new AdmZip(filepath);
         const entries = zip.getEntries();
         
         entries.forEach((entry) => {
           if (entry.isDirectory) return;
           fileList.push({
             file: entry.entryName.replace(/\\/g, "/"),
             data: entry.getData().toString("base64"),
             encoding: "base64",
           });
         });
       } else if (ext === ".html") {
         fileList.push({
           file: "index.html",
           data: fs.readFileSync(filepath).toString("base64"),
           encoding: "base64",
         });
       } else {
         fs.unlinkSync(filepath);
         return m.reply("❌ Hanya mendukung file .html atau .zip");
       }
       
       const deployData = {
         name: sitename,
         files: fileList,
         projectSettings: { framework: null },
       };
       
       const deploy = await axios.post(
         "https://api.vercel.com/v13/deployments",
         deployData,
         {
           headers: {
             Authorization: `Bearer ${VER_TOKEN}`,
             "Content-Type": "application/json",
           },
         }
       );
       
       const previewUrl = `https://${sitename}.vercel.app`;
       
       const up = await upload(fs.readFileSync(filepath), "smail.my.id/cloud")
       
       fs.unlinkSync(filepath);
       await m.reply(`✅ Sukses deploy!\n🌍 URL: ${up.link}\n${previewUrl}`);
     } catch (err) {
       console.error("❌ Error deploy:", err?.response?.data || err.message);
       await m.reply(`❌ Gagal deploy: ${err?.response?.data?.error?.message || err.message}`);
     }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}

async function upload(buffer, type) {
  try {
    
    let mime, ext
    try {
      ({ mime, ext } = await fileTypeFromBuffer(buffer))
    } catch (e) {
      mime = "text/html", ext = "html"
    }
    
    const form = new FormData();
    form.append('file', buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });
    form.append('uploader', type);

    const response = await axios.post(`${apiUrl}/uploader`, form, {
      headers: form.getHeaders()
    });

    return response.data
  } catch (err) {
    return err.response?.data || err.message
  }
}
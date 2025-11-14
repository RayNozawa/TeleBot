import axios from 'axios'
import moment from 'moment-timezone'

export const run = {
   usage: ['githubstalk'],
   hidden: ['ghstalk'],
   category: 'internet',
   async: async (m, {
      conn,
      text,
      Func,
      env,
      isPrefix,
      command
   }) => {
     if (!text) return m.reply(`Masukan perintah dengan tambahan username!`)
     
     conn.sendChatAction(m.chat, "typing")
     
     let Quer = text.replace("https://github.com/", "").replace("@", "")
axios.get(`https://api.github.com/users/${Quer}`)
.then((res) =>{
let {
 login, 
 type,
 name,
 followers, 
 following, 
 created_at, 
 updated_at,
 public_gists,
 public_repos,
 twitter_username,
 bio,
 hireable,
 email,
 location, 
 blog,
 company,
 avatar_url,
 html_url
} = res.data
var teks = `*User Name :* ${login}
*Nick Name :* ${name}
*Followers :* ${followers}
*Following :* ${following}
*Public Gists :* ${public_gists}
*Public Repos :* ${public_repos}
*Twitter :* ${twitter_username==null?'-':twitter_username}
*Email :* ${email==null?'-':email}
*Location :* ${location==null?'-':location}
*Blog :* ${blog}
*Link :* ${html_url}
*Created Time :*
  - Date : ${moment(created_at).tz('Asia/Jakarta').format('DD-MM-YYYY')}
  - Time : ${moment(created_at).tz('Asia/Jakarta').format('HH:mm:ss')}
*Updated Time :* 
  - Date : ${moment(updated_at).tz('Asia/Jakarta').format('DD-MM-YYYY')}
  - Time : ${moment(updated_at).tz('Asia/Jakarta').format('HH:mm:ss')}
*Bio :* ${bio}`
conn.sendButton(m.chat, donateBtn, avatar_url, 'github.jpg', teks, m.msg, env.wm);
})
   },
   error: false,
   restrict: true,
   cache: true,
   limit: true,
   location: __filename
}
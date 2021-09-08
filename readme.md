# Profit Trailer Tools.
A basic website to interact with profit trailer.
___
## Instructions:
<ol>
<li> Clone pt-tools to the same machine as profit trailer</li>

    git clone https://github.com/carlpwilliams/pt-tools-web.git 

<li> CD into the newly created pt-tools-web directory</li>

    cd pt-tools-web

<li> install dependencies</li>

    npm i

<li> Edit config.json</li>

<li> Run pt-tools with pm2</li>

     sudo pm2 start index.js --name= pt-tools-web
     
</ol>
Visit your bot url with the port 1501 (or the port specified in config)
<pre>i.e http://192.168.0.20:1501 or http://mybot.com:1501</pre>

___
Note:
This tool accesses the Profit Trailer database directly. It only reads data, but it's worth making a backup of your data before running this tool.
If your bot seems to restart or has any problems, stop this tool immediately and restore your data backup.

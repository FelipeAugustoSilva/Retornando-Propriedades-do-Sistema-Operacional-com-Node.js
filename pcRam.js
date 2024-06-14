const os = require('os');
const osu = require('os-utils');  // Adicione o módulo os-utils
const macaddress = require('node-macaddress');

// Retorna o IP da Máquina
function getLocalIP() {
    const nets = os.networkInterfaces();
    let localIP = 'N/A';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Pula endereços que não são IPv4 e internos (ou seja, 127.0.0.1)
            if (net.family === 'IPv4' && !net.internal) {
                localIP = net.address;
                break;
            }
        }
    }

    return localIP;
}

// Retorna o MAC da Máquina
function getMacAddress() {
  return new Promise((resolve, reject) => {
    macaddress.one((err, mac) => {
      if (err) {
        console.error('Error obtaining MAC address:', err);
        reject(err); // Lida com o erro adequadamente (opcional)
        return;
      }

      resolve(mac);
    });
  });
}

setInterval(async () => {
    const { arch, platform, totalmem, freemem, cpus, hostname, type, release, uptime, userInfo } = os;
    const tRam = totalmem() / 1024 / 1024;
    const fRam = freemem() / 1024 / 1024;
    const usage = ((tRam - fRam) / tRam) * 100;
    const cpuCount = cpus().length;
    const userInfoObj = userInfo();
    const uptimeSeconds = uptime();
    const uptimeHours = (uptimeSeconds / 360000);
    
    try {
        const macAddress = await getMacAddress();
        
        osu.cpuUsage(cpuPercentage => {
            const stats = {
                OS: platform(), // Plataforma do sistema operacional
                Arch: arch(), // Arquitetura da CPU
                OS_Type: type(), // Tipo do sistema operacional
                OS_Release: release(), // Versão do sistema operacional
                Uptime: `${uptimeHours.toFixed(2)} hours`, // Tempo aproximado de máquina ligada

                Hostname: hostname(),
                Username: userInfoObj.username,
                Homedir: userInfoObj.homedir,

                CPU_Count: cpuCount, // Número de núcleos da CPU
                CPU_Model: cpus()[0].model, // Modelo da CPU
                CPU_Usage: `${(cpuPercentage * 100).toFixed(2)} %`, // Percentual de uso de CPU

                TotalRAM: `${parseInt(tRam)} MB`, // Total de RAM em MB
                FreeRAM: `${parseInt(fRam)} MB`, // RAM livre em MB
                RAM_Usage: `${usage.toFixed(2)} %`, // Percentual de uso de RAM

                LocalIP: getLocalIP(),
                MAC_Address: macAddress, // Endereço MAC da máquina
            };

            console.clear();
            console.table(stats);

            exports.stats = stats;
        });
    } catch (err) {
        console.error('Error obtaining MAC address:', err);
    }
}, 1000);

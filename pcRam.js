const os = require('os');
const osu = require('os-utils');  // Adicione o módulo os-utils

function getLocalIP() {
    const nets = os.networkInterfaces();
    let localIP = 'N/A';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                localIP = net.address;
                break;
            }
        }
    }

    return localIP;
}

function getNetworkInterfaces() {
    const nets = os.networkInterfaces();
    const interfaces = {};
  
    for (const name of Object.keys(nets)) {
      interfaces[name] = [];
      for (const net of nets[name]) {
        interfaces[name].push({
          family: net.family,
          address: net.address,
          netmask: net.netmask,
          mac: net.mac,
        });
      }
    }
  
    return interfaces;
  }

setInterval(() => {
    const { arch, platform, totalmem, freemem, cpus, hostname, type, release, uptime, userInfo } = os;
    const tRam = totalmem() / 1024 / 1024;
    const fRam = freemem() / 1024 / 1024;
    const usage = ((tRam - fRam) / tRam) * 100;
    const cpuCount = cpus().length;
    const userInfoObj = userInfo();

    osu.cpuUsage(cpuPercentage => {
        const stats = {

            OS: platform(),
            Arch: arch(),
            OS_Type: type(),
            OS_Release: release(),
            Uptime: `${(uptime() / 3600).toFixed(2)} hours`,

            Hostname: hostname(),
            Username: userInfoObj.username,
            Homedir: userInfoObj.homedir,

            CPU_Count: cpuCount,
            CPU_Model: cpus()[0].model,
            TotalRAM: `${parseInt(tRam)} MB`,
            FreeRAM: `${parseInt(fRam)} MB`,
            RAM_Usage: `${usage.toFixed(2)} %`,
            CPU_Usage: `${(cpuPercentage * 100).toFixed(2)} %`,

            LocalIP: getLocalIP(),
            interfaces: getNetworkInterfaces()
        };

        console.clear();
        console.table(stats);

        exports.stats = stats;
    });
}, 1000);

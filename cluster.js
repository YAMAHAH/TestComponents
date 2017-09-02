let cluster = require("cluster");
let os = require("os");

const cpus = os.cpus();

if (cluster.isMaster) {
    cpus.forEach(() => {
        cluster.fork();
    });
    cluster.on('listening', (worker) => {
        console.log('Cluster %d connected', worker.process.pid);
    });

    cluster.on('disconnect', (worker) => {
        console.log('Cluster %d disconnect', worker.process.pid);
    });

    cluster.on('exit', (worker) => {
        console.log('Cluster %d dead', worker.process.pid);
        worker.fork();
    });
} else {
    require('./server.js');
}
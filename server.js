const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const host = "127.0.0.1";
const hubPath = path.join(rootDir, "index.html");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function sendIndexFromDirectory(res, dirPath, onMissing) {
  const indexPath = path.join(dirPath, "index.html");
  fs.stat(indexPath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(res, indexPath);
      return;
    }

    onMissing();
  });
}

function serveCandidate(res, candidatePath, onMissing) {
  fs.stat(candidatePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(res, candidatePath);
      return;
    }

    if (!err && stats.isDirectory()) {
      sendIndexFromDirectory(res, candidatePath, onMissing);
      return;
    }

    onMissing();
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const safePath = path.normalize(urlPath).replace(/^([.]{2}[/\\])+/, "");
  const rootPath = path.join(rootDir, safePath);
  const clientPath = path.join(rootDir, "client", safePath);

  if (urlPath === "/" || urlPath === "/index.html") {
    sendFile(res, hubPath);
    return;
  }

  serveCandidate(res, rootPath, () => {
    serveCandidate(res, clientPath, () => {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    });
  });
});

function openBrowser(url) {
  const platform = process.platform;
  let command;
  let args;

  if (platform === "darwin") {
    command = "open";
    args = [url];
  } else if (platform === "win32") {
    command = "cmd";
    args = ["/c", "start", "", url];
  } else {
    command = "xdg-open";
    args = [url];
  }

  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.unref();
}

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Mini Game Hub is ready at ${url}`);
  openBrowser(url);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});

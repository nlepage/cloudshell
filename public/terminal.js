import { Terminal } from 'xterm'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { SerializeAddon } from 'xterm-addon-serialize'
import { Unicode11Addon } from 'xterm-addon-unicode11'
import { WebLinksAddon } from 'xterm-addon-web-links'

const terminal = new Terminal({
  screenKeys: true,
  useStyle: true,
  cursorBlink: true,
  fullscreenWin: true,
  maximizeWin: true,
  screenReaderMode: true,
  cols: 128,
});
terminal.open(document.getElementById("terminal"));
const protocol = location.protocol === "https:" ? "wss://" : "ws://";
const url = protocol + location.host + "/xterm.js";
const ws = new WebSocket(url);
const attachAddon = new AttachAddon(ws);
var fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
var webLinksAddon = new WebLinksAddon();
terminal.loadAddon(webLinksAddon);
var unicode11Addon = new Unicode11Addon();
terminal.loadAddon(unicode11Addon);
var serializeAddon = new SerializeAddon();
terminal.loadAddon(serializeAddon);
ws.onclose = function (event) {
  console.log(event);
  terminal.write(
    "\r\n\nconnection has been terminated from the server-side (hit refresh to restart)\n\r"
  );
};
ws.onopen = function () {
  terminal.loadAddon(attachAddon);
  terminal._initialized = true;
  terminal.focus();
  setTimeout(function () {
    fitAddon.fit();
  });
  terminal.onResize(function (event) {
    var rows = event.rows;
    var cols = event.cols;
    var size = JSON.stringify({ cols: cols, rows: rows + 1 });
    var send = new TextEncoder().encode("\x01" + size);
    console.log("resizing to", size);
    ws.send(send);
  });
  terminal.onTitleChange(function (event) {
    console.log(event);
  });
  window.onresize = function () {
    fitAddon.fit();
  };
};

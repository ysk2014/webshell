import { Terminal } from 'xterm';
import 'xterm/dist/xterm.css';
import 'xterm/lib/addons/fullscreen/fullscreen.css';
import '@/assets/css/index.css';

import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';

import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen.js';

import * as search from 'xterm/lib/addons/search/search.js';

Terminal.applyAddon(fit);
Terminal.applyAddon(attach);
Terminal.applyAddon(fullscreen);
Terminal.applyAddon(search);


export default Terminal;

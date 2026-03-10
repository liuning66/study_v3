<template>
	<div class="xtermal-container">
		<div class="card-header">
			<h2>Xterm.js 终端演示</h2>
		</div>
		<el-card class="xtermal-card">
			<template #header>
				<div class="card-header">
					<span>终端演示</span>
					<el-button-group>
						<el-button size="small" circle @click="handleClear">
							<el-icon><Refresh /></el-icon>
						</el-button>
						<el-button size="small" circle @click="handleSendCommand('ls -la')">
							<el-icon><Document /></el-icon>
						</el-button>
						<el-button size="small" circle @click="handleSendCommand('pwd')">
							<el-icon><Location /></el-icon>
						</el-button>
					</el-button-group>
				</div>
			</template>
			<div ref="terminalRef" class="terminal-container"></div>
			<div class="input-container">
				<span class="prompt">$</span>
				<el-input
					v-model="command"
					@keyup.enter="handleEnter"
					placeholder="输入命令..."
					class="command-input"
					clearable
				/>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Refresh, Document, Location } from '@element-plus/icons-vue';

// 终端引用
const terminalRef = ref<HTMLElement>();
// 终端实例
let terminal: Terminal;
// 适配插件
let fitAddon: FitAddon;
// 命令输入
const command = ref('');

// 初始化终端
onMounted(() => {
	if (terminalRef.value) {
		// 创建终端实例 - VS Code 终端风格
		terminal = new Terminal({
			cursorBlink: true,
			cursorStyle: 'block',
			scrollback: 1000,
			theme: {
				// VS Code 终端风格
				background: '#1e1e1e',
				foreground: '#d4d4d4',
				cursor: '#ffffff',
				black: '#000000',
				red: '#f48771',
				green: '#57ab5a',
				yellow: '#e6c229',
				blue: '#61afef',
				magenta: '#c678dd',
				cyan: '#56b6c2',
				white: '#d4d4d4',
				brightBlack: '#666666',
				brightRed: '#f48771',
				brightGreen: '#57ab5a',
				brightYellow: '#e6c229',
				brightBlue: '#61afef',
				brightMagenta: '#c678dd',
				brightCyan: '#56b6c2',
				brightWhite: '#ffffff',
			},
			fontFamily: 'Consolas, Monaco, "Courier New", monospace',
		});

		// 创建适配插件
		fitAddon = new FitAddon();
		terminal.loadAddon(fitAddon);

		// 挂载终端
		terminal.open(terminalRef.value);
		fitAddon.fit();

		// 初始化终端内容
		terminal.writeln('Welcome to Xterm.js Terminal Demo');
		terminal.writeln('Type commands below:');
		terminal.writeln('');
		terminal.write('$ ');

		// 监听窗口大小变化
		window.addEventListener('resize', handleResize);

		// 监听终端输入
		terminal.onData((data) => {
			handleTerminalData(data);
		});
	}
});

// 清理资源
onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
	terminal.dispose();
});

// 处理窗口大小变化
const handleResize = () => {
	fitAddon.fit();
};

// 处理终端输入
const handleTerminalData = (data: string) => {
	switch (data) {
		case '\r': // 回车
			terminal.writeln('');
			executeCommand(command.value);
			command.value = '';
			// 不在这里显示提示符，而是在executeCommand执行完毕后显示
			break;
		case '\x7f': // 退格
			if (command.value.length > 0) {
				command.value = command.value.slice(0, -1);
				terminal.write('\b \b');
			}
			break;
		default: // 其他字符
			command.value += data;
			terminal.write(data);
			break;
	}
};

// 执行命令
const executeCommand = (cmd: string) => {
	if (!cmd.trim()) {
		// 如果命令为空，直接显示新的提示符
		terminal.write('$ ');
		return;
	}

	// 模拟命令执行
	setTimeout(() => {
		switch (cmd.trim()) {
			case 'ls':
			case 'ls -la':
				terminal.writeln('total 20');
				terminal.writeln('drwxr-xr-x  5 user  staff   160 Mar  8 10:00 \x1b[36m.\x1b[0m');
				terminal.writeln('drwxr-xr-x  3 user  staff    96 Mar  8 09:00 \x1b[36m..\x1b[0m');
				terminal.writeln(
					'-rw-r--r--  1 user  staff   245 Mar  8 09:30 \x1b[96mpackage.json\x1b[0m',
				);
				terminal.writeln(
					'-rw-r--r--  1 user  staff  1024 Mar  8 09:45 \x1b[96mREADME.md\x1b[0m',
				);
				terminal.writeln('drwxr-xr-x 10 user  staff   320 Mar  8 10:00 \x1b[36msrc\x1b[0m');
				// 命令执行完毕后显示新的提示符
				terminal.write('$ ');
				break;
			case 'pwd':
				terminal.writeln('\x1b[96m/home/user/project\x1b[0m');
				// 命令执行完毕后显示新的提示符
				terminal.write('$ ');
				break;
			case 'clear':
				terminal.clear();
				terminal.writeln('Welcome to Xterm.js Terminal Demo');
				terminal.writeln('Type commands below:');
				terminal.writeln('');
				// 命令执行完毕后显示新的提示符
				terminal.write('$ ');
				break;
			case 'help':
				terminal.writeln('Available commands:');
				terminal.writeln('  \x1b[32mls\x1b[0m       - List files and directories');
				terminal.writeln(
					'  \x1b[32mls -la\x1b[0m   - List files and directories with details',
				);
				terminal.writeln('  \x1b[32mpwd\x1b[0m      - Print current working directory');
				terminal.writeln('  \x1b[32mclear\x1b[0m    - Clear terminal');
				terminal.writeln('  \x1b[32mhelp\x1b[0m     - Show this help message');
				// 命令执行完毕后显示新的提示符
				terminal.write('$ ');
				break;
			default:
				terminal.writeln(`\x1b[31mCommand not found:\x1b[0m ${cmd}`);
				// 命令执行完毕后显示新的提示符
				terminal.write('$ ');
				break;
		}
	}, 300);
};

// 给命令添加颜色（保留此函数以备将来使用）
const colorizeCommand = (cmd: string): string => {
	const parts = cmd.trim().split(' ');
	if (parts.length === 0) return cmd;

	// 第一个单词（命令）用绿色
	let colored = `\x1b[32m${parts[0]}\x1b[0m`;

	// 其他单词（参数）用黄色
	for (let i = 1; i < parts.length; i++) {
		colored += ` \x1b[33m${parts[i]}\x1b[0m`;
	}

	return colored;
};

// 处理回车键
const handleEnter = () => {
	if (command.value) {
		terminal.writeln('');
		executeCommand(command.value);
		command.value = '';
		terminal.write('$ ');
	}
};

// 处理清除终端
const handleClear = () => {
	terminal.clear();
	terminal.writeln('Welcome to Xterm.js Terminal Demo');
	terminal.writeln('Type commands below:');
	terminal.writeln('');
	terminal.write('$ ');
};

// 处理发送命令
const handleSendCommand = (cmd: string) => {
	command.value = cmd;
	handleEnter();
};
</script>

<style scoped>
.xtermal-container {
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.xtermal-card {
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.terminal-container {
	height: 400px;
	overflow: hidden;
	border-radius: 4px;
	text-align: left;
	display: flex;
	flex-direction: column;
}

/* 确保终端内容左对齐 */
.terminal-container :deep(.xterm) {
	text-align: left !important;
}

.terminal-container :deep(.xterm-viewport) {
	text-align: left !important;
}

.terminal-container :deep(.xterm-screen) {
	text-align: left !important;
}

.terminal-container :deep(.xterm-rows) {
	text-align: left !important;
}

.terminal-container :deep(.xterm-row) {
	text-align: left !important;
	padding-left: 0;
	margin-left: 0;
}

.input-container {
	display: flex;
	align-items: center;
	padding: 8px 16px;
	background-color: #1e1e1e;
	border-top: 1px solid #333;
}

.prompt {
	margin-right: 8px;
	font-weight: bold;
	color: #67c23a;
	font-family: 'Consolas, Monaco, "Courier New", monospace';
}

.command-input {
	flex: 1;
	border: none;
	background: transparent;
	outline: none;
}

.command-input.vs-code-style :deep(.el-input__wrapper) {
	box-shadow: none;
	background-color: transparent;
	border: none;
}

.command-input.vs-code-style :deep(.el-input__input) {
	font-family: 'Consolas, Monaco, "Courier New", monospace';
	color: #d4d4d4;
	padding: 0;
}

.command-input.vs-code-style :deep(.el-input__clear) {
	color: #888;
}

.command-input.vs-code-style :deep(.el-input__clear:hover) {
	color: #d4d4d4;
}
</style>

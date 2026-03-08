<template>
  <div class="xtermal-container">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { Refresh, Document, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 终端引用
const terminalRef = ref<HTMLElement>()
// 终端实例
let terminal: Terminal
// 适配插件
let fitAddon: FitAddon
// 命令输入
const command = ref('')

// 初始化终端
onMounted(() => {
  if (terminalRef.value) {
    // 创建终端实例
    terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 1000,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        selection: 'rgba(255, 255, 255, 0.3)',
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
    })

    // 创建适配插件
    fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    // 挂载终端
    terminal.open(terminalRef.value)
    fitAddon.fit()

    // 初始化终端内容
    terminal.writeln('Welcome to Xterm.js Terminal Demo')
    terminal.writeln('Type commands below:')
    terminal.writeln('')
    terminal.write('$ ')

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    // 监听终端输入
    terminal.onData((data) => {
      handleTerminalData(data)
    })
  }
})

// 清理资源
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  terminal.dispose()
})

// 处理窗口大小变化
const handleResize = () => {
  fitAddon.fit()
}

// 处理终端输入
const handleTerminalData = (data: string) => {
  switch (data) {
    case '\r': // 回车
      terminal.writeln('')
      executeCommand(command.value)
      command.value = ''
      terminal.write('$ ')
      break
    case '\x7f': // 退格
      if (command.value.length > 0) {
        command.value = command.value.slice(0, -1)
        terminal.write('\b \b')
      }
      break
    default: // 其他字符
      command.value += data
      terminal.write(data)
      break
  }
}

// 执行命令
const executeCommand = (cmd: string) => {
  if (!cmd.trim()) {
    return
  }

  // 模拟命令执行
  setTimeout(() => {
    switch (cmd.trim()) {
      case 'ls':
      case 'ls -la':
        terminal.writeln('total 20')
        terminal.writeln('drwxr-xr-x  5 user  staff   160 Mar  8 10:00 .')
        terminal.writeln('drwxr-xr-x  3 user  staff    96 Mar  8 09:00 ..')
        terminal.writeln('-rw-r--r--  1 user  staff   245 Mar  8 09:30 package.json')
        terminal.writeln('-rw-r--r--  1 user  staff  1024 Mar  8 09:45 README.md')
        terminal.writeln('drwxr-xr-x 10 user  staff   320 Mar  8 10:00 src')
        break
      case 'pwd':
        terminal.writeln('/home/user/project')
        break
      case 'clear':
        terminal.clear()
        terminal.writeln('Welcome to Xterm.js Terminal Demo')
        terminal.writeln('Type commands below:')
        terminal.writeln('')
        break
      case 'help':
        terminal.writeln('Available commands:')
        terminal.writeln('  ls       - List files and directories')
        terminal.writeln('  ls -la   - List files and directories with details')
        terminal.writeln('  pwd      - Print current working directory')
        terminal.writeln('  clear    - Clear terminal')
        terminal.writeln('  help     - Show this help message')
        break
      default:
        terminal.writeln(`Command not found: ${cmd}`)
        break
    }
  }, 300)
}

// 处理回车键
const handleEnter = () => {
  if (command.value) {
    terminal.writeln('')
    executeCommand(command.value)
    command.value = ''
    terminal.write('$ ')
  }
}

// 处理清除终端
const handleClear = () => {
  terminal.clear()
  terminal.writeln('Welcome to Xterm.js Terminal Demo')
  terminal.writeln('Type commands below:')
  terminal.writeln('')
  terminal.write('$ ')
}

// 处理发送命令
const handleSendCommand = (cmd: string) => {
  command.value = cmd
  handleEnter()
}
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
}

.input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.prompt {
  margin-right: 8px;
  font-weight: bold;
  color: #67c23a;
}

.command-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
}

.command-input :deep(.el-input__wrapper) {
  box-shadow: none;
}

.command-input :deep(.el-input__input) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>

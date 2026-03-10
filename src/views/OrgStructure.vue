<template>
  <div class="page-container">
    <!-- 顶部提示条 -->
    <Alert show-icon class="top-alert">
      企业空间是平台基础配置第一步：先搭建组织架构，再在「计算设施」中录入服务器并选择归属节点，最后在「访问控制」中进行角色与项目权限配置。
    </Alert>

    <!-- 页面标题 -->
    <div class="page-header">
      <Icon type="md-git-network" class="header-icon" />
      <span class="header-title">组织架构</span>
    </div>

    <Row :gutter="16" class="main-content">
      <!-- 左侧：组织树 -->
      <Col span="5">
        <Card :bordered="false" dis-hover class="left-panel">
          <div class="panel-header">
            <span class="panel-title"><Icon type="md-people" /> 组织树</span>
            <Dropdown>
              <Button size="small">
                更多操作
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <template #list>
                <DropdownMenu>
                  <DropdownItem>新增子节点</DropdownItem>
                  <DropdownItem>导入架构</DropdownItem>
                  <DropdownItem>导出架构</DropdownItem>
                </DropdownMenu>
              </template>
            </Dropdown>
          </div>
          
          <div class="tree-container">
            <!-- 使用 render-content 自定义树节点样式 -->
            <Tree :data="orgTreeData" :render="renderTreeNode" @on-select-change="handleNodeSelect"></Tree>
          </div>
        </Card>
      </Col>

      <!-- 右侧：详情区域 -->
      <Col span="19">
        <Card :bordered="false" dis-hover class="right-panel">
          
          <!-- 1. 节点头部信息 -->
          <div class="node-header">
            <div class="node-info">
              <h2 class="node-title">{{ currentNode.name }}</h2>
              <div class="node-meta">
                <span class="status-badge" :class="currentNode.status">
                  <span class="dot"></span> {{ currentNode.statusText }}
                </span>
                <span class="description">描述：{{ currentNode.description }}</span>
              </div>
            </div>
            <div class="node-actions">
              <Button icon="md-create">编辑节点</Button>
            </div>
          </div>

          <Divider style="margin: 16px 0;" />

          <!-- 2. 统计卡片 -->
          <Row :gutter="16" class="stats-row">
            <Col span="8" v-for="(stat, index) in statsData" :key="index">
              <div class="stat-card">
                <div class="stat-header">
                  <Icon :type="stat.iconType" :style="{color: stat.color}" />
                  <span>{{ stat.label }}</span>
                </div>
                <div class="stat-value" :style="{color: stat.color}">{{ stat.value }}</div>
              </div>
            </Col>
          </Row>

          <!-- 3. Tab页签与列表 -->
          <div class="list-section">
            <Tabs v-model="currentTab">
              <TabPane :label="`物理服务器 ( ${statsData[0].value} )`" name="physical">
                <Table :columns="columns" :data="serverList" stripe>
                  
                  <!-- 自定义列模板：主机名 -->
                  <template #hostname="{ row }">
                    <span class="hostname-tag">{{ row.hostname }}</span>
                  </template>

                  <!-- 自定义列模板：状态 -->
                  <template #status="{ row }">
                    <div class="status-cell">
                      <span class="dot" :class="row.status === 'normal' ? 'green' : 'red'"></span>
                      <span>{{ row.status === 'normal' ? '正常' : '异常' }}</span>
                    </div>
                  </template>

                  <!-- 自定义列模板：挂载集群 -->
                  <template #cluster="{ row }">
                    <Tag color="blue" type="border">{{ row.cluster }}</Tag>
                  </template>

                </Table>
              </TabPane>
              <TabPane :label="`虚拟服务器 ( ${statsData[1].value} )`" name="virtual">
                <div class="empty-placeholder">虚拟服务器列表内容...</div>
              </TabPane>
              <TabPane :label="`GPU 服务器 ( ${statsData[2].value} )`" name="gpu">
                <div class="empty-placeholder">GPU 服务器列表内容...</div>
              </TabPane>
            </Tabs>
          </div>

        </Card>
      </Col>
    </Row>
  </div>
</template>

<script setup>
import { ref, reactive, h, resolveComponent } from 'vue';
import  { useCounterStore } from '../stores/counter';
// --- 数据结构定义 (模拟后端返回) ---
const counterData = useCounterStore();
// 1. 左侧树形结构数据
const orgTreeData = ref([
  {
    title: '大唐集团',
    expand: true,
    status: 'normal', // 对应后端 status 字段
    children: [
      {
        title: '山东区域',
        expand: true,
        status: 'warning',
        children: [
          { title: '东营电厂', status: 'normal' },
          { title: '黄岛电厂', status: 'normal' },
          { title: '鲁北电厂', status: 'error' },
          { title: '滨州电厂', status: 'normal' },
          { title: '临清电厂', status: 'warning' },
          { title: '郓城电厂', status: 'normal' }
        ]
      },
      {
        title: '江苏区域',
        expand: true,
        status: 'normal',
        children: [
          { title: '吕四港电厂', status: 'normal' },
          { title: '南京电厂', status: 'normal' },
          { title: '徐塘电厂', status: 'normal' }
        ]
      }
    ]
  }
]);

// 2. 当前选中节点的详情信息
const currentNode = reactive({
  id: '1001',
  name: '大唐集团',
  status: 'normal', // class name mapping
  statusText: '运行正常',
  description: '大唐国际发电股份有限公司'
});

// 3. 统计数据
const statsData = ref([
  { label: '物理服务器', value: 10, color: '#2d8cf0', iconType: 'md-desktop' },
  { label: '虚拟服务器', value: 12, color: '#19be6b', iconType: 'md-cloud-outline' },
  { label: 'GPU 服务器', value: 1, color: '#722ed1', iconType: 'md-flash' }
]);

// 4. 列表数据 (Tab 1: 物理服务器)
const currentTab = ref('physical');
const serverList = ref([
  { hostname: 'phy-master-01', ip: '10.10.1.1', cpu: 'Intel Xeon Gold 6338 × 2', mem: '256Gi', status: 'normal', cluster: 'datang-k8s-main' },
  { hostname: 'phy-master-02', ip: '10.10.1.2', cpu: 'Intel Xeon Gold 6338 × 2', mem: '256Gi', status: 'normal', cluster: 'datang-k8s-main' },
  { hostname: 'phy-worker-01', ip: '10.10.1.11', cpu: 'Intel Xeon Platinum 8358 × 2', mem: '512Gi', status: 'normal', cluster: 'datang-k8s-main' },
  { hostname: 'phy-worker-02', ip: '10.10.1.12', cpu: 'Intel Xeon Platinum 8358 × 2', mem: '512Gi', status: 'error', cluster: 'datang-k8s-main' }, // 模拟异常
  { hostname: 'phy-test-01', ip: '10.10.2.1', cpu: 'Intel Xeon Gold 6248 × 2', mem: '128Gi', status: 'normal', cluster: 'datang-k8s-test' },
  { hostname: 'edge-srv-dy-01', ip: '192.168.10.100', cpu: 'Intel Xeon E-2278G', mem: '64Gi', status: 'normal', cluster: 'datang-edge-cluster' },
  { hostname: 'edge-srv-dy-03', ip: '192.168.10.102', cpu: 'Intel Xeon E-2278G', mem: '32Gi', status: 'error', cluster: 'datang-edge-cluster' }, // 模拟异常
]);

// --- 表格列定义 ---
const columns = [
  { title: '主机名', slot: 'hostname', width: 180 },
  { title: 'IP', key: 'ip', width: 150 },
  { title: 'CPU', key: 'cpu' },
  { title: '内存', key: 'mem', width: 100 },
  { title: '状态', slot: 'status', width: 100 },
  { title: '挂载集群', slot: 'cluster', width: 180, align: 'right' }
];

// --- 逻辑方法 ---

// 自定义树节点渲染 (为了实现那个带颜色的小圆点)
const renderTreeNode = (h, { root, node, data }) => {
  let color = '#19be6b'; // 默认 green
  if (data.status === 'warning') color = '#ff9900';
  if (data.status === 'error') color = '#ed4014';

  return h('span', {
    style: { display: 'inline-flex', alignItems: 'center', cursor: 'pointer', width: '100%' }
  }, [
    h('span', { style: { marginRight: '8px' } }, data.title),
    h('span', {
      style: {
        display: 'inline-block',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color
      }
    })
  ]);
};

// 点击树节点事件模拟
const handleNodeSelect = (selectedArray, currentNodeData) => {
  if (currentNodeData) {
    console.log('Fetching details for:', currentNodeData.title);
    // 这里调用后端 API 获取右侧详情数据
    currentNode.name = currentNodeData.title;
    // 模拟重置数据...
  }
};
</script>

<style scoped>
/* 基础布局样式 */
.page-container {
  padding: 16px;
  background-color: #f5f7f9;
  min-height: 100vh;
}

.top-alert {
  margin-bottom: 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.page-header {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  color: #17233d;
}
.header-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #2d8cf0;
}
.header-title {
  font-weight: bold;
  font-size: 14px;
}

/* 卡片通用样式 */
.left-panel, .right-panel {
  min-height: 600px;
  background: #fff;
  border-radius: 4px;
}

/* 左侧树样式 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
}
.panel-title {
  font-weight: bold;
  font-size: 14px;
}

/* 右侧内容样式 */
.node-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.node-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #17233d;
}
.node-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
}
.status-badge {
  display: flex;
  align-items: center;
  color: #17233d;
}
.status-badge.normal .dot { background: #19be6b; }
.status-badge.normal { color: #19be6b; } /* 仅文字颜色根据需要调整 */

.description {
  color: #808695;
}

/* 统计卡片区 */
.stats-row {
  margin-bottom: 24px;
}
.stat-card {
  text-align: center;
  padding: 16px 0;
  border-right: 1px solid #e8eaec; /* 分割线 */
}
/* 去掉最后一个卡片的右边框 */
.ivu-col:last-child .stat-card {
  border-right: none;
}
.stat-header {
  font-size: 12px;
  color: #808695;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
}


/* 表格自定义样式 */
.hostname-tag {
  background: #f8f8f9;
  padding: 4px 8px;
  border-radius: 2px;
  color: #515a6e;
  border: 1px solid #e8eaec;
  font-family: 'Courier New', Courier, monospace;
}
.status-cell {
  display: flex;
  align-items: center;
}
.status-cell .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}
.status-cell .dot.green { background-color: #19be6b; }
.status-cell .dot.red { background-color: #ed4014; }

.empty-placeholder {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>

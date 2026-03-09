<template>
  <div class="child">
    <h3>Child Component</h3>
    <p>这是一个业务组件，未来会在2-3个组件中复用</p>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>子组件内容</span>
        </div>
      </template>
      <div class="child-content">
        <p>父组件传递的数据: {{ name }} -- {{ age }}, {{ parentCount }}</p>
        <el-button type="primary" @click="handleClick">触发父组件事件</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

interface ChildProps {
  name?: string ;
  age: number;
}

// 定义组件属性
const props = withDefaults(defineProps<ChildProps>(), {
  name: '默认名字',
});


var parentCount = inject('globalKey');

// 定义组件事件
const emit = defineEmits<{
  (e: 'on-click', data: string): void;
}>();

// 处理点击事件
const handleClick = () => {
  emit('on-click', '子组件触发了事件');
};
</script>

<style scoped lang="less">
.child {
  width: 100%;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.child-content {
  margin-top: 10px;
}
</style>
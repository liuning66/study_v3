<template>
	<div class="grammer">
		<el-button type="primary" @click="handleClick">点击我</el-button>
		<p>点击次数: {{ count }}</p>
		{{ storeCount }}
		<el-input v-model="computedValue" placeholder="请输入姓名"></el-input>
		<Child :name="reactiveObject.name" :age="reactiveObject.age" @on-click="handleChildClick"></Child>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, Ref, computed, watch, provide, toRefs } from 'vue';
import Child from './Child.vue';

import { useCounterStore } from '../stores/counter';
// 修复解构丢失响应式问题
import { storeToRefs } from 'pinia';
interface User {
	name: string;
	age: number;
}
var count: Ref<number> = ref(0);
var refObject: Ref<HTMLElement | null> = ref(null);
var reactiveObject = reactive<User>({
	name: '张三',
	age: 18,
});
// 解构会丢失响应式,使用toRefs进行修复
var {name, age} = toRefs(reactiveObject); 

const counterStore = useCounterStore();
const { count: storeCount, doubleCount } = storeToRefs(counterStore);

provide('globalKey', count);

var reactiveArray = reactive<number[]>([1, 2, 3]);

var reactiveMap = reactive<Map<string, number>>(
	new Map([
		['a', 1],
		['b', 2],
	]),
);

var reactiveSet = reactive<Set<string>>(new Set(['apple', 'banana', 'orange']));
var reactiveWeakMap = reactive<WeakMap<object, number>>(new WeakMap());

var computedValue: Ref<number> = computed(() => count.value * 2);

watch(count, (newValue, oldValue) => {
	console.log(`count changed from ${oldValue} to ${newValue}`);
});

function handleClick() {
	count.value++;
}
function handleChildClick(data: string) {
	console.log('父组件接收到子组件事件:', data);
}

</script>

<style scoped lang="less">
.grammer {
	width: 100%;
	height: 100%;
}
</style>

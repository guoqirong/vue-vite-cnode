<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import ListItem, { topicListItemType } from '@/components/list-item/index.vue';
import { randomNum } from '@/utils';

defineExpose({
  name: 'ListComp',
});

const props = defineProps({
  // 列表数据
  listData: {
    typeof: Array as PropType<topicListItemType[]>,
    default: [],
  },
  // 加载中
  isLoading: {
    type: Boolean,
    default: false,
  },
  // 列表条数
  limit: {
    type: Number,
    default: 20,
  },
  // 是否简单列表
  isSimpleItem: {
    type: Boolean,
    default: false,
  },
});

// 列表数据
const list = ref<topicListItemType[]>([]);
watch(() => props.listData, (val) => {
  list.value = val as topicListItemType[];
});

// 加载中
const loading = ref();
watch(() => props.isLoading, (val) => {
  loading.value = val;
});

// 列表条数
const listLength = ref(props.limit);
watch(() => props.limit, (val) => {
  listLength.value = val;
});

// 查看详情
const emit = defineEmits(['seeDetail']);
const seeDetail = (v: string) => {
  emit('seeDetail', v);
};
</script>

<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <div v-for="i in listLength" :key="i">
        <div class="list-skeleton-item">
          <el-skeleton-item class="skeleton-user-img" />
          <el-skeleton-item class="skeleton-reply-count" />
          <el-skeleton-item class="skeleton-topic-tab" />
          <el-skeleton-item :style="{
            width: `calc(${randomNum(30, 100)}% - 280px)`
          }" />
          <el-skeleton-item class="skeleton-created-time" />
        </div>
      </div>
    </template>
    <template #default>
      <div class="list-body" v-if="list.length">
        <list-item
          v-for="item in list"
          :key="item.id"
          :itemData="item"
          :isSimpleItem="isSimpleItem"
          @seeDetail="seeDetail"
        ></list-item>
      </div>
      <el-empty v-else description="暂无数据" />
    </template>
  </el-skeleton>
</template>

<style lang="scss" src="./index.scss"></style>
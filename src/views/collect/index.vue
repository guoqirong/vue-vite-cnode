
<script setup lang="ts">
import { computed, ref } from 'vue';
import PageWrapper from '@/components/page-wrapper/index.vue';
import ListComp from '@/components/list/index.vue';
import ClientQrCodeComp from '@/components/client-qr-code/index.vue';
import UserInfoComp from '@/components/user-info/index.vue';
import useHttpRequest from '@/utils/request';
import { topicListItemType } from '@/components/list-item/index.vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { routerPush } from '@/utils';

const { state } = useStore();
// 个人信息
const userData = computed(() => {
  return state.user.simpleUserData;
});

// 列表数据获取
const { isLoading, adornUrl, httpRequest } = useHttpRequest();
const collect = ref<topicListItemType[]>([]);
const getData = () => {
  if (userData.value && userData.value.loginname) {
    httpRequest ({
      url: adornUrl(`/api/v1/topic_collect/${userData.value.loginname}`),
      method: 'get'
    }).then(({data}) => {
      collect.value = data.data;
    }).catch(e => {
      ElMessage.error('请求失败');
      console.error(e);
    })
  } else {
  routerPush('/index');
  }
};
getData();

// 查看详情
const seeDetail = (id: string) => {
  routerPush({
    path: `/detail`,
    query: {
      id: id,
    }
  });
};
</script>

<template>
  <div class="collect">
    <page-wrapper>
      <!-- 左侧内容 -->
      <el-card class="box-card">
        <template #header>
          <span class="card-title">我的收藏</span>
        </template>
        <div>
          <list-comp
            :isLoading="isLoading"
            :listData="(collect as never[])"
            @seeDetail="seeDetail"
          />
        </div>
      </el-card>
      <!-- 右侧内容 -->
      <template #right>
        <user-info-comp />
        <client-qr-code-comp />
      </template>
    </page-wrapper>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
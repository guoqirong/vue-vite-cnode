
<script setup lang="ts">
import { routerPush } from '@/utils';
import useHttpRequest from '@/utils/request';
import { ElForm as Form, ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const { isLoading, adornUrl, httpRequest } = useHttpRequest();
const { commit } = useStore();
const router = useRouter();
const ruleFormRef = ref<InstanceType<typeof Form>>();
const form = reactive({
  token: '',
});
const rules = reactive({
  token: [
    { required: true, message: '请输入token校验', trigger: 'blur' }
  ],
});

// 登录提交按钮
const onSubmit = () => {
  if(!ruleFormRef.value) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      httpRequest ({
        url: adornUrl(`/api/v1/accesstoken`),
        method: 'post',
        data: {
          accesstoken: form.token
        }
      }).then(({data}) => {
        localStorage.setItem('loginname', data.loginname);
        localStorage.setItem('token', form.token);
        commit('user/updateToken', form.token);
        commit('user/updateSimpleUserData', data);
        routerPush('/');
      }).catch(e => {
        ElMessage.error('登录失败');
        console.error(e);
      })
    } else {
      return false;
    }
  });
};

// 取消离开登录页面
const onCancel = () => {
  router.go(-1);
};
</script>

<template>
  <div class="login-body">
    <span class="login-slogan">欢迎来到 CNode 中文社区</span>
    <!-- 登录表单 -->
    <el-card class="box-card">
      <template #header>
        <span class="login-title">token 登录</span>
      </template>
      <el-form
        class="login-form"
        :model="form"
        :rules="rules"
        ref="ruleFormRef"
        label-width="0px">
        <el-form-item prop="token">
          <el-input
            v-model="form.token"
            placeholder="accesstoken 登录校验"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            @click="onSubmit"
            :loading="isLoading"
          >登录</el-button>
          <el-button
            class="cencel-btn"
            @click="onCancel"
            :loading="isLoading"
          >取消</el-button>
        </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>
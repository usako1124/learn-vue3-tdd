<script setup>
import { computed, reactive, ref } from "vue";

const data = reactive({
  username: "",
  email: "",
  password: "",
  passwordCheck: "",
});

const isDisabled = computed(() => {
  if (
    data.username &&
    data.email &&
    data.password &&
    data.password === data.passwordCheck
  )
    return false;
  return true;
});
</script>

<template>
  <h1>Sign Up</h1>
  <label for="username">ユーザー名</label>
  <input type="text" id="username" v-model="data.username" />
  <label for="email">メールアドレス</label>
  <input type="text" id="email" v-model="data.email" />
  <label for="password">パスワード</label>
  <input type="password" id="password" v-model="data.password" />
  <label for="passwordCheck">パスワード（確認用）</label>
  <input type="password" id="passwordCheck" v-model="data.passwordCheck" />
  <button v-bind:disabled="isDisabled">登録</button>
</template>

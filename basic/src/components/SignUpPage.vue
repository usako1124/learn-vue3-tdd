<script setup>
import axios from "axios";
import { computed, reactive } from "vue";

const data = reactive({
  username: "",
  email: "",
  password: "",
  passwordCheck: "",
  errorMessage: "",
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

const submit = async () => {
  try {
    await axios.post("/api/v1/users", {
      username: data.username,
      email: data.email,
      password: data.password,
    });
  } catch (error) {
    data.errorMessage = error.response.data.error.message;
  }
};
</script>

<template>
  <form action="">
    <h1>Sign Up</h1>
    <label for="username">ユーザー名</label>
    <input type="text" id="username" v-model="data.username" />
    <label for="email">メールアドレス</label>
    <input type="text" id="email" v-model="data.email" />
    <label for="password">パスワード</label>
    <input type="password" id="password" v-model="data.password" />
    <label for="passwordCheck">パスワード（確認用）</label>
    <input type="password" id="passwordCheck" v-model="data.passwordCheck" />
    <button v-bind:disabled="isDisabled" v-on:click.prevent="submit">
      登録
    </button>
    <p v-if="data.errorMessage">{{ data.errorMessage }}</p>
  </form>
</template>

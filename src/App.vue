<template>
  <div class="comments">
    <CommentForm
      v-model="content"
      @custom-submit="addComment"
    />
    <CommentList />
  </div>
</template>

<script lang="ts" setup>
import CommentForm from './components/CommentForm.vue';
import CommentList from './components/CommentList.vue';

import {ref} from "vue";
import {useCommentsStore} from "@/store/comments";

const store = useCommentsStore();
const content = ref('');

const addComment = () => {
  if (content.value.trim()) {
    store.addComment(content.value);
    content.value = '';
  }
};

</script>

<style>
  body {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
  }

  .comments {
    display: flex;
    flex-flow: column;
    gap: 24px;
    max-width: 800px;
    margin: 0 auto;
    padding: 80px 15px 40px;
  }
</style>

<template>
  <div class="comments-form">
    <input
        v-model="content"
        @keydown.enter="addComment"
        class="comments-form__input"
        placeholder="Write a comment..."
    />
    <div
        @click="addComment"
        class="comments-form__submit"
        :class="content ? 'comments-form__submit--active' : ''"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useCommentsStore } from '@/store/comments';

const store = useCommentsStore();
const content = ref('');

const addComment = () => {
  if (content.value.trim()) {
    store.addComment(content.value);
    content.value = '';
  }
};
</script>

<style lang="scss">
  .comments-form {
    position: relative;
  }

  .comments-form__input {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 999px;
    font-size: 16px;
    color: #000;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    padding: 0 40px 0 20px;
    outline: none;
    transition: all .2s;

    &:hover,
    &:focus {
      border-color: #000;
    }

    &::placeholder {
      color: #576F76;
    }
  }

  .comments-form__submit {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nO2WvU4CQRSFv5ewQIFYWkglFfICJEB8Dv58FjsJxsKSnp832TX2mrWDpROi2eRuQkhm9s7sYig4yWk2M/lyz9y5s3DWCaoKDIElEAIbcSjfBkClSOAVMAa2wG+Gd8AUuM4LfQBiBfDQa6DrC32UClyh+9WPfCrd5YDuw9WVlz3jtcV+qQG/FghNPdFcGU33pr4H6kCUsW4rSRo1dKzkTvbdKuB9G3jhCI4EqoHPbOAPj/P7Bmqy/wb4NKwLbeC1YVMDveqW7nYGJ010VPB7AVF/GdYFJ9lcgyNep54NXHEcIE3lAPnJGiCJXjzOOcvPKB9+U3f7eAWUUKrlGLntWexooalGBfwIJLPfS13P2JN42+TUBfAknamp8s3lTDUqy9M2lykUiwMZDj3NlTmL/9YfNi2U/BCr614AAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-size: 100%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    transition: all .2s;
    opacity: .2;
    pointer-events: none;

    &:hover {
      opacity: .7;
    }

    &--active {
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>

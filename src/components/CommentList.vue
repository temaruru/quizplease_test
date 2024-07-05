<template>
  <div class="comments-list">
    <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
    />
  </div>
</template>

<script lang="ts" setup>
import { useCommentsStore } from '@/store/comments';
import CommentItem from './CommentItem.vue';

const store = useCommentsStore();
const comments = store.comments;
</script>

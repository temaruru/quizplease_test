<template>
  <div
      v-if="comment.active"
      class="comment"
      :class="comment.children.length ? 'comment--hasChildren' : ''"
  >
    <div class="comment__inner">
      <div class="comment__header">
        <div class="comment__header-avatar">
          <img :src="comment.avatar" class="comment__header-avatar-image" alt="Avatar" />
        </div>
        <span class="comment__header-author">{{ comment.username }}</span>
        <span class="comment__header-date">{{ comment.createdAt }}</span>
      </div>

      <p class="comment__text">
        {{ comment.content }}
      </p>

      <div class="comment-actions">
        <div
            @click="rate(1)"
            class="comment-actions__button comment-actions__button-like"
            :class="comment.userVote === 1 ? 'comment-actions__button--disabled' : ''"
        />
        <div class="comment-actions__rating">
          {{ comment.rating }}
        </div>
        <div
            @click="rate(-1)"
            class="comment-actions__button comment-actions__button-dislike"
            :class="comment.userVote === -1 ? 'comment-actions__button--disabled' : ''"
        />
        <div @click="toggleReply" class="comment-actions__action">Reply</div>
        <div @click="toggleEdit" class="comment-actions__action">Edit</div>
        <div @click="deleteComment" class="comment-actions__action">Delete</div>
      </div>

      <div v-if="isEditing">
        <div class="comments-form">
          <input
              v-model="editContent"
              @keydown.enter="saveEdit"
              class="comments-form__input"
              placeholder="Write a comment..."
          />
          <div
              @click="saveEdit"
              class="comments-form__submit"
              :class="editContent ? 'comments-form__submit--active' : ''"
          />
        </div>
      </div>
      <div v-if="isReplying">
        <div class="comments-form">
          <input
              v-model="replyContent"
              @keydown.enter="addReply"
              class="comments-form__input"
              placeholder="Write a comment..."
          />
          <div
              @click="addReply"
              class="comments-form__submit"
              :class="replyContent ? 'comments-form__submit--active' : ''"
          />
        </div>
      </div>
      <div
          v-if="comment.children.length"
          @click="toggleComments"
          class="comment__toggle"
          :class="!comment.collapsedChildren ? 'comment__toggle--minus' : 'comment__toggle--plus'"
      />
    </div>

    <div
        v-if="comment.children.length"
        class="comment-children"
    >
      <div v-if="!comment.collapsedChildren">
        <CommentItem
            v-for="child in comment.children"
            :key="child.id"
            :comment="child"
        />
      </div>
    </div>
  </div>
  <div
      v-else
      class="comment--hidden"
  >
    Comment has been deleted...
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { useCommentsStore } from '@/store/comments';
import CommentItem from './CommentItem.vue';
import {IComment} from "@/interfaces";

const props = defineProps<{
  comment: IComment;
}>();

const store = useCommentsStore();
const isReplying = ref(false);
const isEditing = ref(false);
const replyContent = ref('');
const editContent = ref(props.comment.content);

const toggleReply = () => {
  if (isEditing.value) {
    isEditing.value = false;
  }
  isReplying.value = !isReplying.value;
};

const toggleEdit = () => {
  if (isReplying.value) {
    isReplying.value = false;
  }
  isEditing.value = !isEditing.value;
};

const addReply = () => {
  store.addComment(replyContent.value, props.comment.id);
  replyContent.value = '';
  isReplying.value = false;
};

const saveEdit = () => {
  store.updateComment(props.comment.id, editContent.value);
  isEditing.value = false;
};

const deleteComment = () => {
  store.deleteComment(props.comment.id);
};

const rate = (delta: number) => {
  store.rateComment(props.comment.id, delta);
};

const toggleComments = () => {
  store.toggleComment(props.comment.id);
}
</script>

<style scoped lang="scss">
  .comment {
    padding-left: 40px;
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      padding-left: 30px;
    }
  }

  .comment--hidden {
    padding: 15px 0;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid #dddddd;
    border-radius: 8px;

    & + & {
      margin-top: 15px;
    }
  }

  .comment__inner {
    position: relative;

    &::before {
      .comment--hasChildren > & {
        content: '';
        display: block;
        position: absolute;
        width: 1px;
        height: calc(100% - 15px);
        top: 3px;
        bottom: 0;
        left: -24px;
        background: #000;

        @media (max-width: 768px) {
          left: -19px;
        }
      }
    }
  }

  .comment__header {
    display: flex;
    gap: 8px;
    align-items: center;
    position: relative;
    left: -40px;

    @media (max-width: 768px) {
      gap: 5px;
      left: -30px;
    }
  }

  .comment__header-avatar {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }

  .comment__header-avatar-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 32px;

    @media (max-width: 768px) {
      max-width: 24px;
    }
  }

  .comment__header-author {
    font-size: 12px;
    font-weight: 700;
    color: #181C1F;
  }

  .comment__header-date {
    font-size: 12px;
    color: #5C6C74;
    display: flex;
    align-items: center;

    &::before {
      content: '•';
      font-size: 6px;
      margin-right: 8px;
    }
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      gap: 9px;
    }
  }

  .comment-actions__button {
    width: 14px;
    height: 14px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    transition: all .2s;

    &:hover {
      opacity: .5;
    }
  }

  .comment-actions__button--disabled {
    opacity: .2;
    pointer-events: none;
  }

  .comment-actions__button-like {
    background-image: url("data:image/svg+xml,%3Csvg rpl='' fill='currentColor' height='16' icon-name='upvote-outline' viewBox='0 0 20 20' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3C!--%3Flit$547048475$--%3E%3C!--%3Flit$547048475$--%3E%3Cpath d='M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z'%3E%3C/path%3E%3C!--%3F--%3E%3C/svg%3E");
  }

  .comment-actions__button-dislike {
    background-image: url("data:image/svg+xml,%3Csvg rpl='' fill='currentColor' height='16' icon-name='downvote-outline' viewBox='0 0 20 20' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3C!--%3Flit$547048475$--%3E%3C!--%3Flit$547048475$--%3E%3Cpath d='M10 20a1.122 1.122 0 0 1-.834-.372l-7.872-8.581A1.251 1.251 0 0 1 1.118 9.7 1.114 1.114 0 0 1 2.123 9H6V2.123A1.125 1.125 0 0 1 7.123 1h5.754A1.125 1.125 0 0 1 14 2.123V9h3.874a1.114 1.114 0 0 1 1.007.7 1.25 1.25 0 0 1-.171 1.345l-7.876 8.589A1.128 1.128 0 0 1 10 20Zm-7.684-9.75L10 18.69l7.741-8.44H12.75v-8h-5.5v8H2.316Zm15.469-.05c-.01 0-.014.007-.012.013l.012-.013Z'%3E%3C/path%3E%3C!--%3F--%3E%3C/svg%3E");
  }

  .comment-actions__rating {
    font-size: 12px;
    font-weight: 500;
  }

  .comment-actions__action {
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .comment__text {
    font-size: 14px;
    color: #131313;
    margin: 10px 0 15px;
  }

  .comment__toggle {
    width: 15px;
    height: 15px;
    background-color: #fff;
    background-size: contain;
    position: absolute;
    left: -31px;
    bottom: 0;
    transition: all .2s;
    cursor: pointer;

    &:hover {
      opacity: .5;
    }

    @media (max-width: 768px) {
      left: -26px;
    }
  }

  .comment__toggle--minus {
    background-image: url("data:image/svg+xml,%3Csvg rpl='' fill='currentColor' height='16' icon-name='leave-outline' viewBox='0 0 20 20' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3C!--%3Flit$6935734626$--%3E%3C!--%3Flit$6935734626$--%3E%3Cpath d='M14 10.625H6v-1.25h8v1.25ZM20 10a10 10 0 1 0-10 10 10.011 10.011 0 0 0 10-10Zm-1.25 0A8.75 8.75 0 1 1 10 1.25 8.76 8.76 0 0 1 18.75 10Z'%3E%3C/path%3E%3C!--%3F--%3E%3C/svg%3E ");
  }

  .comment__toggle--plus {
    background-image: url("data:image/svg+xml,%3Csvg rpl='' fill='currentColor' height='16' icon-name='join-outline' viewBox='0 0 20 20' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.625 9.375H14v1.25h-3.375V14h-1.25v-3.375H6v-1.25h3.375V6h1.25v3.375ZM20 10A10 10 0 1 1 10 0a10.011 10.011 0 0 1 10 10Zm-1.25 0A8.75 8.75 0 1 0 10 18.75 8.76 8.76 0 0 0 18.75 10Z'%3E%3C/path%3E%3C/svg%3E");
  }

  .comment-children {
    margin-top: 20px;
  }

  .comments-form {
    margin-top: 16px;
  }
</style>

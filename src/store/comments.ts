import { defineStore } from 'pinia';
import { AvatarGenerator } from 'random-avatar-generator';

import {IComment, IState} from "@/interfaces";
import {formatDate, getRandomInt} from "@/helpers";

// Случайные ники, для демонстрации
const nicknames = ['Teknoeh', 'biblosaurus', 'flibbidygibbit', 'eXclurel', 'AImoneyhowto', 'CroatianSensation79'];

export const useCommentsStore = defineStore('comments', {
  state: (): IState => ({
    comments: [],
  }),
  actions: {
    addComment(content: string, parentId: number | null = null) {
      const newComment: IComment = {
        id: Date.now(),
        parentId,
        content,
        rating: 0,
        children: [],
        userVote: null,
        avatar: new AvatarGenerator().generateRandomAvatar(),
        username: nicknames[getRandomInt(2)],
        createdAt: formatDate(new Date()),
        active: true,
        collapsedChildren: false,
      };
      if (parentId === null) {
        this.comments.push(newComment);
      } else {
        const parentComment = this.findCommentById(parentId);
        if (parentComment) {
          parentComment.children.push(newComment);
        }
      }
    },
    findCommentById(id: number): IComment | undefined {
      const find = (comments: IComment[]): IComment | undefined => {
        for (const comment of comments) {
          if (comment.id === id) return comment;
          const found = find(comment.children);
          if (found) return found;
        }
        return undefined;
      };
      return find(this.comments);
    },
    updateComment(id: number, content: string) {
      const comment = this.findCommentById(id);
      if (comment) {
        comment.content = content;
      }
    },
    deleteComment(id: number) {
      const comment = this.findCommentById(id);
      if (comment) {
        comment.active = false;
      }
    },
    rateComment(id: number, delta: number) {
      const comment = this.findCommentById(id);
      if (comment) {
        if (comment.userVote === null) {
          comment.rating += delta;
          comment.userVote = delta;
        } else if (comment.userVote !== delta) {
          comment.rating += delta * 2; // отменяем предыдущий голос и добавляем новый
          comment.userVote = delta;
        }
      }
    },
    toggleComment(id: number) {
      const comment = this.findCommentById(id);
      if (comment && comment.children.length > 0) {
        comment.collapsedChildren = !comment.collapsedChildren;
      }
    },
  },
});

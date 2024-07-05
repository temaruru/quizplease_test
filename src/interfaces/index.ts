export interface IComment {
  id: number;
  parentId: number | null;
  content: string;
  rating: number;
  children: IComment[];
  userVote: number | null;
  avatar: string;
  username: string;
  createdAt: string;
  active: boolean;
  collapsedChildren: boolean;
}

export interface IState {
  comments: IComment[];
}

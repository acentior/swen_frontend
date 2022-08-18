export enum Input {
  Email,
  Username,
  Password,
  Confirm,
  Comment
}

export type MediaPost = {
  url: string,
  preview: string,
  comment: string,
  created_at: string,
  created_by: string,
  location: [number, number]
}

export type MapPost = {
  location: [number, number],
  posts: {
    url: string,
    comment: string,
    created_at: string,
    created_by: string,
  }[]
}

export type MediasResponse = {
  id: number,
  comment: null | string,
  content: null | {
    id: number,
    original_url: string,
    preview_url: string
  },
  created_at: string,
  created_by_id: number,
  created_by: {
    name: string
  },
  cluster: {
    id: number,
    latitude: string,
    longitude: string
  }
}

export enum AlertTypes {
    SUCCESS= 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    NONE =' none'
}
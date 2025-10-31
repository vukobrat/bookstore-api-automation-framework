export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

export interface CreateAuthorRequest {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

export interface UpdateAuthorRequest {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

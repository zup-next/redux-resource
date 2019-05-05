export type Status = 'pristine' | 'pending' | 'success' | 'error'

export type SagaEventHandler = (data: { requestData?: Object, responseData: Object }) => void

export interface ResourceOperation {
  status: Status,
  error: null | Object,
}

export interface Resource<T>  {
  data: T | null,
  load: ResourceOperation,
  create: ResourceOperation,
  update: ResourceOperation,
  remove: ResourceOperation,
}

export interface Action {
  type: string,
  params?: Object,
  error?: Object,
  data?: Object,
}

export interface FunctionMap {
  [key: string]: (...args: any) => any,
}

export interface ResourceTypes {
  LOAD: string,
  LOAD_PROGRESS: string,
  LOAD_SUCCESS: string,
  LOAD_ERROR: string,
  RESET_LOAD_STATUS: string,

  CREATE: string,
  CREATE_PROGRESS: string,
  CREATE_SUCCESS: string,
  CREATE_ERROR: string,
  RESET_CREATE_STATUS: string,

  UPDATE: string,
  UPDATE_PROGRESS: string,
  UPDATE_SUCCESS: string,
  UPDATE_ERROR: string,
  RESET_UPDATE_STATUS: string,

  REMOVE: string,
  REMOVE_PROGRESS: string,
  REMOVE_SUCCESS: string,
  REMOVE_ERROR: string,
  RESET_REMOVE_STATUS: string,
}

export interface ResourceActions {
  load: (params?: any) => Action,
  setLoadProgress: () => Action,
  setLoadSuccess: (data: any) => Action,
  setLoadError: (error: any) => Action,
  resetLoadStatus: () => Action,

  create: (data?: any) => Action,
  setCreateProgress: () => Action,
  setCreateSuccess: () => Action,
  setCreateError: (error: any) => Action,
  resetCreateStatus: () => Action,

  update: (data?: any) => Action,
  setUpdateProgress: () => Action,
  setUpdateSuccess: () => Action,
  setUpdateError: (error: any) => Action,
  resetUpdateStatus: () => Action,

  remove: (data?: any) => Action,
  setRemoveProgress: () => Action,
  setRemoveSuccess: () => Action,
  setRemoveError: (error: any) => Action,
  resetRemoveStatus: () => Action,
}

export interface ResourceApi {
  load?: (params?: any) => Promise<any>,
  create?: (data?: any) => Promise<any>,
  update?: (data?: any) => Promise<any>,
  remove?: (data?: any) => Promise<any>,
}

export interface ResourceEventHandlers {
  load?: SagaEventHandler,
  create?: SagaEventHandler,
  update?: SagaEventHandler,
  remove?: SagaEventHandler,
}

export interface SagaTree {
  [key: string]: (() => any) | SagaTree,
}
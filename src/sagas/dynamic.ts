import {
  FunctionMap,
  DynamicAction,
  ResourceTypes,
  DynamicSagaEventHandler,
  DynamicResourceActions,
  DynamicResourceApi,
  DynamicResourceEventHandlers,
} from '../types'
import { call, put } from 'redux-saga/effects'
import { createMissingSagaWarning } from './utils'

interface ModifyResource {
  actions: DynamicResourceActions,
  setPending: (id: string) => DynamicAction,
  setSuccess: (id: string) => DynamicAction,
  setError: (id: string, error: any) => DynamicAction,
  execute: (id: string, data?: any) => Promise<any>,
  onSuccess?: DynamicSagaEventHandler,
}

const loadResource = (
  actions: DynamicResourceActions,
  load: (id: string, params?: Record<string, any>) => Promise<any>,
  onSuccess?: DynamicSagaEventHandler,
) => {
  return function* ({ id, params }: DynamicAction) {
    const { setLoadPending, setLoadSuccess, setLoadError } = actions
    try {
      yield put(setLoadPending(id))
      const data = yield call(load, id, params)
      yield put(setLoadSuccess(id, data))
      if (onSuccess) yield onSuccess({ id, requestData: params, responseData: data }, actions)
    } catch (error) {
      yield put(setLoadError(id, error))
    }
  }
}

const modifyResource = (props: ModifyResource) => {
  const { actions, setPending, setSuccess, setError, execute, onSuccess } = props

  return function* ({ id, data }: DynamicAction) {
    try {
      yield put(setPending(id))
      const response = yield call(execute, id, data)
      yield put(setSuccess(id))
      if (onSuccess) yield onSuccess({ id, requestData: data, responseData: response }, actions)
    } catch (error) {
      yield put(setError(id, error))
    }
  }
}

const createDynamicResourceSagas = (
  actions: DynamicResourceActions,
  types: ResourceTypes,
  api: DynamicResourceApi,
  onSuccess: DynamicResourceEventHandlers = {},
) => {
  const sagas: FunctionMap = {}

  if (api.load) sagas[types.LOAD] = loadResource(actions, api.load, onSuccess.load)
  else sagas[types.LOAD] = createMissingSagaWarning

  if (api.create) {
    const createSaga = modifyResource({
      actions,
      setPending: actions.setCreatePending,
      setSuccess: actions.setCreateSuccess,
      setError: actions.setCreateError,
      execute: api.create,
      onSuccess: onSuccess.create,
    })

    sagas[types.CREATE] = createSaga
  } else {
    sagas[types.CREATE] = createMissingSagaWarning
  }

  if (api.update) {
    const updateSaga = modifyResource({
      actions,
      setPending: actions.setUpdatePending,
      setSuccess: actions.setUpdateSuccess,
      setError: actions.setUpdateError,
      execute: api.update,
      onSuccess: onSuccess.update,
    })

    sagas[types.UPDATE] = updateSaga
  } else {
    sagas[types.UPDATE] = createMissingSagaWarning
  }

  if (api.remove) {
    const removeSaga = modifyResource({
      actions,
      setPending: actions.setRemovePending,
      setSuccess: actions.setRemoveSuccess,
      setError: actions.setRemoveError,
      execute: api.remove,
      onSuccess: onSuccess.remove,
    })

    sagas[types.REMOVE] = removeSaga
  } else {
    sagas[types.REMOVE] = createMissingSagaWarning
  }

  return sagas
}

export default createDynamicResourceSagas

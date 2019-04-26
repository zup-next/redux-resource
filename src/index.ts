import { createResourceActions } from './actions'
import { createReducer, createResourceReducer } from './reducers'
import { createResourceSagas } from './sagas'

const createResource = (namespace: string, api: ResourceApi, sagasOnSuccessHandlers: ResourceEventHandlers) => {
  const { actions, types } = createResourceActions(namespace)
  const reducers = createResourceReducer(types)
  const sagas = createResourceSagas(actions, types, api, sagasOnSuccessHandlers)

  return { actions, types, reducers, sagas }
}

export default createResource
export * from './status'
export {
  createResourceActions,
  createReducer,
  createResourceReducer,
  createResourceSagas,
}

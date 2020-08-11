import { Status, Resource } from '../types'
import { AnyAction } from 'redux'

interface Handlers<State> {
  [key: string]: (state: State, action: AnyAction) => State
}

export const createReducer = <State>(
  initialState: State,
  handlers: Handlers<State>,
) => (state = initialState, action: AnyAction) =>
    handlers[action.type] ? handlers[action.type](state, action) : state

export const createResourceInitialState = (): Resource<any> => ({
  data: null,
  load: { status: Status.pristine, error: null },
  create: { status: Status.pristine, error: null },
  update: { status: Status.pristine, error: null },
  remove: { status: Status.pristine, error: null },
})

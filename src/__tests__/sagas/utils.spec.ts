import { createEffects, getTypeToSagaMap, createMissingSagaWarning } from '../../sagas/utils'
import { all, takeEvery, takeLatest } from 'redux-saga/effects'

describe('Saga utilities', () => {
  it('should create effects with default', () => {
    const sagas = {
      SAGA_1: jest.fn(),
      SAGA_2: jest.fn(),
    }

    const rootSaga = createEffects(sagas)
    expect(rootSaga.next().value).toEqual(all([
      takeEvery('SAGA_1', sagas['SAGA_1']),
      takeEvery('SAGA_2', sagas['SAGA_2']),
    ]))
    expect(rootSaga.next().done).toBeTruthy()
  })

  it('should create effects with takeLatest', () => {
    const sagas = {
      SAGA_1: jest.fn(),
      SAGA_2: jest.fn(),
    }

    const rootSaga = createEffects(sagas, takeLatest)
    expect(rootSaga.next().value).toEqual(all([
      takeLatest('SAGA_1', sagas['SAGA_1']),
      takeLatest('SAGA_2', sagas['SAGA_2']),
    ]))
    expect(rootSaga.next().done).toBeTruthy()
  })

  it('should get type to saga map from saga tree', () => {
    const sagas = {
      catalog: {
        plans: {
          'PLANS/LOAD': jest.fn(),
          'PLANS/CREATE': jest.fn(),
        },
        addons: {
          'ADDONS/LOAD': jest.fn(),
        },
      },
      order: {
        'ORDER/CREATE': jest.fn(),
      },
      LOAD: jest.fn(),
    }

    const typeToSagaMap = getTypeToSagaMap(sagas)

    expect(typeToSagaMap).toEqual({
      'PLANS/LOAD': sagas.catalog.plans['PLANS/LOAD'],
      'PLANS/CREATE': sagas.catalog.plans['PLANS/CREATE'],
      'ADDONS/LOAD': sagas.catalog.addons['ADDONS/LOAD'],
      'ORDER/CREATE': sagas.order['ORDER/CREATE'],
      LOAD: sagas['LOAD'],
    })
  })

  it('should create log about missing saga', () => {
    const originalConsoleLog = console.log
    console.log = jest.fn()
    createMissingSagaWarning({ type: 'PLANS/LOAD' })
    expect(console.log).toHaveBeenCalledWith(
      '%cWarning: missing saga for resource. No api function has been provided for action PLANS/LOAD',
      'color: red',
    )
    console.log = originalConsoleLog
  })
})

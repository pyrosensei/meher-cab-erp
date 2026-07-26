import { useAppStore } from './store'

test('current user uses generic demo identity', () => {
  const state = useAppStore.getState()
  expect(state.currentUser.name).toBe('Employee')
  expect(state.currentUser.email).toBe('employee@example.com')
  expect(state.currentUser.role).toBe('Staff')
  expect(state.currentUser.avatar).toBe('EM')
})

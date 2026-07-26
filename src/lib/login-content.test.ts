import { CAR_IMAGES, LOGIN_FEATURES } from './login-content'

test('login content constants stay aligned', () => {
  expect(CAR_IMAGES).toHaveLength(4)
  expect(LOGIN_FEATURES).toHaveLength(3)
  expect(LOGIN_FEATURES.map((item) => item.text)).toEqual([
    '25 Active Vehicles',
    'Real-time Tracking',
    'Performance Analytics',
  ])
})

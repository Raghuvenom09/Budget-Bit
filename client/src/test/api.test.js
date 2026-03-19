import { describe, it, expect } from 'vitest'

describe('API Helper Functions', () => {
  it('should export api object', async () => {
    const { api } = await import('../api')
    expect(api).toBeDefined()
    expect(api.restaurants).toBeDefined()
    expect(api.reviews).toBeDefined()
    expect(api.bills).toBeDefined()
    expect(api.users).toBeDefined()
    expect(api.storage).toBeDefined()
    expect(api.ai).toBeDefined()
  })
})

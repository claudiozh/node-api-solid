import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma-test-environment',
  async setup() {
    console.log('Executou Setup')

    return {
      teardown: async () => {
        console.log('Executou Teardown')
      },
    }
  },
}

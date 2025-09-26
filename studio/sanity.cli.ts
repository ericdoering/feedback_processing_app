import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  server: {
    port: 3334
  },
  studioHost: 'feedback-course-ericD',
  api: {
    projectId: 'vajhpjto',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})

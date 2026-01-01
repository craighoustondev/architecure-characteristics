import type { Characteristic } from '../types'

export const architectureCharacteristics: Characteristic[] = [
  {
    name: 'Performance',
    description: 'The amount of time it takes for the system to process a business request',
    emoji: '⚡'
  },
  {
    name: 'Responsiveness',
    description: 'The amount of time it takes to get a response to the user',
    emoji: '⏱️'
  },
  {
    name: 'Availability',
    description: 'The amount of uptime of a system; usually measured in 9\'s (e.g., 99.9%)',
    emoji: '🟢'
  },
  {
    name: 'Fault Tolerance',
    description: 'When fatal errors occur, other parts of the system continue to function',
    emoji: '🛡️'
  },
  {
    name: 'Scalability',
    description: 'A function of system capacity and growth over time; as the number of users or requests increase in the system, responsiveness, performance, and error rates remain consistent',
    emoji: '📈'
  },
  {
    name: 'Elasticity',
    description: 'The system is able to expend and respond quickly to unexpected or anticipated extreme loads (e.g., going from 20 to 250,000 users instantly)',
    emoji: '🎈'
  },
  {
    name: 'Data Integrity',
    description: 'The data across the system is correct and there is no data loss in the system',
    emoji: '✅'
  },
  {
    name: 'Data Consistency',
    description: 'The data across the system is in sync and consistent across databases and tables',
    emoji: '🔄'
  },
  {
    name: 'Adaptability',
    description: 'The ease in which a system can adapt to changes in environment and functionality',
    emoji: '🦎'
  },
  {
    name: 'Concurrency',
    description: 'The ability of the system to process simultaneous requests, in most cases in the same order in which they were received; implied when scalability and elasticity are supported',
    emoji: '⚙️'
  },
  {
    name: 'Interoperability',
    description: 'The ability of the system to interface and interact with other systems to complete a business request',
    emoji: '🔌'
  },
  {
    name: 'Extensibility',
    description: 'The ease in which a system can be extended with additional features and functionality',
    emoji: '🧩'
  },
  {
    name: 'Deployability',
    description: 'The amount of ceremony involved with releasing the software, the frequency in which releases occur, and the overall risk of deployment',
    emoji: '🚀'
  },
  {
    name: 'Testability',
    description: 'The ease of and completeness of testing',
    emoji: '🧪'
  },
  {
    name: 'Abstraction',
    description: 'The level at which parts of the system are isolated from other parts of the system (both internal and external system interactions)',
    emoji: '📦'
  },
  {
    name: 'Workflow',
    description: 'The ability of the system to manage complex workflows that require multiple parts (services) of the system to complete a business request',
    emoji: '🔀'
  },
  {
    name: 'Configurability',
    description: 'The ability of the system to support multiple configurations, as well as support custom on-demand configurations and configuration updates',
    emoji: '⚙️'
  },
  {
    name: 'Recoverability',
    description: 'The ability of the system to start where it left off in the event of a system crash',
    emoji: '♻️'
  },
  {
    name: 'Feasibility',
    description: 'Taking into account timeframes, budgets, and developer skills when making architectural choices; tight timeframes and budgets make this a driving architectural characteristic',
    emoji: '💰'
  },
  {
    name: 'Security',
    description: 'The ability of the system to restrict access to sensitive information or functionality',
    emoji: '🔒'
  },
  {
    name: 'Maintainability',
    description: 'The level of effort required to locate and apply changes to the system',
    emoji: '🔧'
  },
  {
    name: 'Observability',
    description: 'The ability of a system or a service to make available and stream metrics such as overall health, uptime, response times, performance, etc.',
    emoji: '👁️'
  }
]

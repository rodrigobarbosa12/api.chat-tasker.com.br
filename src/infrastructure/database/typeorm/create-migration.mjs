import { execSync } from 'child_process'

const migrationName = process.argv[2]

if (!migrationName) {
  console.error('Por favor, forneça um nome para a migração.')
  process.exit(1)
}

execSync(
  `yarn typeorm migration:create src/infrastructure/database/typeorm/migrations/${migrationName}`,
  { stdio: 'inherit' },
)

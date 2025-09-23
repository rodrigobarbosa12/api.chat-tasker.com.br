import 'dotenv/config'
import { configapp } from './infrastructure/config/server-config'

async function bootstrap() {
  const { PORT_SERVER } = process.env

  const app = await configapp()

  await app.listen(PORT_SERVER, '0.0.0.0', () => {
    console.log(`Server running in: http://0.0.0.0:${PORT_SERVER}`)
  })
}

bootstrap()

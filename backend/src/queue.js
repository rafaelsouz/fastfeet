// Este arquivo vai ser executado separado da aplicação, pois a nossa fila pode está em outro servidor
// E dessa forma a fila nunca vai influencia o restante da nossa aplicação
import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();

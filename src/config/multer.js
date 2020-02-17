import multer from 'multer';
import cyprto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Para evitar arquivos com nomes de iguais, vamos adicionar um codigo unico no nome do arquivo.
    filename: (req, file, cb) => {
      cyprto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

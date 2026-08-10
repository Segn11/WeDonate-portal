import { Router } from 'express';
import { MetaController } from '../controllers/meta.controller';

const router = Router();

router.get('/kebeles', MetaController.getKebeles);
router.get('/woredas', MetaController.getWoredas);

export default router;

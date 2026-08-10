import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const ADAMA_KEBELES = [
  'Kebele 01 (Posta Biet)',
  'Kebele 02 (Awash)',
  'Kebele 03 (St. George)',
  'Kebele 04 (Leku)',
  'Kebele 05 (Bole)',
  'Kebele 06 (Lugaba)',
  'Kebele 07 (Melka Adama)',
  'Kebele 08 (Demdela)',
  'Kebele 09 (Goro)',
  'Kebele 10 (Migira)',
  'Kebele 11 (Wonji Road)',
  'Kebele 12 (Expressway Zone)',
  'Kebele 13 (Apostolic Area)',
  'Kebele 14 (Dera Gate)',
  'Kebele 15',
];

export const ADAMA_WOREDAS = [
  'Bole Sub-City Woreda',
  'Lugaba Sub-City Woreda',
  'Central Adama Woreda',
  'Wonji-Geda Rural Woreda',
];

export class MetaController {
  static getKebeles(req: Request, res: Response) {
    return sendSuccess(res, ADAMA_KEBELES, 'Fetched Adama Kebeles list');
  }

  static getWoredas(req: Request, res: Response) {
    return sendSuccess(res, ADAMA_WOREDAS, 'Fetched Adama Sub-City Woredas list');
  }
}

import { uniService } from '@root/shared/services/db/uni.service';
import { IUniDocument } from '@uni/interfaces/uni.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async unis(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = page > 0 ? page * limit : 0;

    const unis: IUniDocument[] = await uniService.getUniversities(skip, limit);
    res.status(HTTP_STATUS.OK).json({ message: 'Universities', unis });
  }
}

export const getUnis: Get = new Get();

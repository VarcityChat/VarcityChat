import { IUniDocument } from '@uni/interfaces/uni.interface';
import { UniModel } from '@uni/models/uni.model';

class UniService {
  public async createUni(data: IUniDocument): Promise<IUniDocument | null> {
    return await UniModel.create(data);
  }

  public async getUniByName(name: string): Promise<IUniDocument | null> {
    return await UniModel.findOne({ name: name.toLowerCase() });
  }

  public async getUniversities(skip: number, limit: number): Promise<IUniDocument[]> {
    const unis = await UniModel.find({}).skip(skip).limit(limit);
    return unis;
  }
}

export const uniService: UniService = new UniService();

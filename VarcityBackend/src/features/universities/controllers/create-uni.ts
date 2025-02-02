import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { ObjectId } from 'mongodb';
import { validator } from '@global/decorators/joi-validation-decorator';
import { uploadFile } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { uniService } from '@root/shared/services/db/uni.service';
import { uniSchema } from '@uni/schemes/uni.scheme';
import { IUniDocument } from '@uni/interfaces/uni.interface';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(uniSchema)
  public async uni(req: Request, res: Response): Promise<void> {
    const { name, image, address } = req.body;

    const uniExists = await uniService.getUniByName(name);
    if (uniExists) {
      throw new BadRequestError('University already exists');
    }

    const uniObjectId: ObjectId = new ObjectId();

    let imageResponse: UploadApiResponse = {} as UploadApiResponse;
    if (image) {
      const uploadResponse = await uploadFile(image, 'varcity/universities',`${uniObjectId}`, true, true);
      if (!uploadResponse?.public_id) {
        throw new BadRequestError('Error uploading image');
      }
      imageResponse = uploadResponse as UploadApiResponse;
    }

    const uni = await uniService.createUni({
      _id: uniObjectId,
      name: name.toLowerCase().trim(),
      location: {
        address
      },
      image: imageResponse?.secure_url
    } as unknown as IUniDocument);

    res.status(HTTP_STATUS.OK).json({ message: 'University created successfully', uni });
  }
}

export const createUni: Create = new Create();

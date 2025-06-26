import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');

    if (!this.bucketName) {
        throw new Error('Variável de ambiente S3_BUCKET_NAME não definida. Certifique-se de que ela está configurada para o ambiente atual.');
    }
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
        throw new Error('Credenciais AWS S3 (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) não configuradas. Elas devem ser definidas para o ambiente atual.');
    }

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
  }

  async uploadFile(fileBuffer: Buffer, mimeType: string, originalFileName: string): Promise<string> {
    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const key = `consultants/${uniqueFileName}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    try {
      const uploader = new Upload({
        client: this.s3Client,
        params: uploadParams,
      });
      uploader.on('httpUploadProgress', (progress) => {
      });

      const data = await uploader.done();
      return (data as any).Location;
    } catch (error) {
      console.error('Erro ao fazer upload para S3 com SDK v3:', error);
      throw new Error('Falha ao fazer upload da imagem.');
    }
  }

  async deleteFile(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${key} do S3 com SDK v3:`, error);
      throw new Error('Falha ao deletar arquivo do S3.');
    }
  }
}

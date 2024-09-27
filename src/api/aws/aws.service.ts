import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import sharp from "sharp";

export interface IS3Image {
  key: string;
  url: string;
}

export type STATUS = 200 | 500;

export class S3ImageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(region: string, bucketName: string) {
    this.s3Client = new S3Client({ region });
    this.bucketName = bucketName;
  }

  /**
   * Uploads an image to S3 bucket
   * @param key - The key (file name) for the image in S3
   * @param imageBuffer - The image data as a Buffer
   * @param contentType - The MIME type of the image
   * @returns The URL of the uploaded image or 500 if an error occurred
   */
  
  async uploadImage(key: string, imageBuffer: Buffer, contentType: string): Promise<string | STATUS> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: imageBuffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

      return url;
    } catch (ex) {
      const errorMessage = `Error uploading image: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return 500;
    }
  }

  /**
   * Deletes an image from S3 bucket
   * @param key - The key (file name) of the image to delete
   */
  async deleteImage(key: string): Promise<ServiceResponse<boolean>> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return ServiceResponse.success("Image deleted successfully", true);
    } catch (ex) {
      const errorMessage = `Error deleting image: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while deleting the image.",
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Updates an image in S3 bucket (essentially a delete followed by an upload)
   * @param key - The key (file name) of the image to update
   * @param imageBuffer - The new image data as a Buffer
   * @param contentType - The MIME type of the new image
   * @returns The updated image information or null if an error occurred
   */
  async updateImage(key: string, imageBuffer: Buffer, contentType: string): Promise<IS3Image | null> {
    try {
      await this.deleteImage(key);
      const result = await this.uploadImage(key, imageBuffer, contentType);

      if (typeof result === 'string') {
        return { key, url: result };
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (ex) {
      const errorMessage = `Error updating image: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return null;
    }
  }

  /**
   * Generates a signed URL for temporary access to a private S3 object
   * @param key - The key (file name) of the image
   * @param expiresIn - The number of seconds until the signed URL expires
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<ServiceResponse<string | null>> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return ServiceResponse.success("Signed URL generated successfully", url);
    } catch (ex) {
      const errorMessage = `Error generating signed URL: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while generating the signed URL.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Resizes an image
   * @param imageBuffer - The original image data as a Buffer
   * @param width - The target width
   * @param height - The target height
   */

  
  async resizeImage(imageBuffer: Buffer, width: number, height: number): Promise<ServiceResponse<Buffer | null>> {
    try {
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(width, height, { fit: "inside", withoutEnlargement: true })
        .toBuffer();

      return ServiceResponse.success("Image resized successfully", resizedImageBuffer);
    } catch (ex) {
      const errorMessage = `Error resizing image: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while resizing the image.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// Export an instance of the service
export const s3BucketService  = new S3ImageService(process.env.AWS_REGION!, process.env.S3_BUCKET_NAME!);

// Usage example

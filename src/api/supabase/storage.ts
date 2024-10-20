import supabase from './client'; 
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { logger } from '@/server';
import { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME=process.env.BUCKET_NAME!
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF!


function generateRandomFilePath(baseDir: string, file: Express.Multer.File): string {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    return path.join(baseDir, fileName).replace(/\\/g, '/');
}

const handleError = (error: any) => {
  console.error('Error:', error.message);
  throw error;
};

function returnFileUrl(path: string): string {
    return `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}


export const uploadFile = async (file: Express.Multer.File): Promise<string> => {
    try {
        const filePath = generateRandomFilePath("Unique", file);

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype
            });

        if (error) throw error;
        return returnFileUrl(data.path);

    } catch (error) {
        return handleError(error);
    }
};

export const downloadFile = async (
  filePath: string
): Promise<Blob> => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error) {
        logger.error("error updatinfile in supabase " )
        throw error
    }

    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateFile = async (
  file: Express.Multer.File,
  filePath: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .update(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert : true
            });

     if (error) {
        logger.error(`Update file ${filePath} failed`)
        throw error
     }

     return returnFileUrl(data.path);
  } catch (error) {
    return handleError(error);
  }
};

// Delete a file
export const deleteFile = async (
  filePath: string
): Promise<any> => {
  try {
    const { error , data  } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([`Unique/${filePath}`]);

    if (error) {
      logger.error(`Image deletion failed: ${error}`)
      throw error;
    }

    return data 
  } catch (error) {
    return handleError(error);
  }
};

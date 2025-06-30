import { v2 as cloudinary } from "cloudinary";
import { type Request } from "express";

const FOLDER = "odin_book";

export async function uploadFile(file: Request["file"], foldername: string) {
  const { buffer, mimetype } = file!;

  const base64 = Buffer.from(buffer).toString("base64");
  const dataURI = `data:${mimetype};base64,${base64}`;
  const folder = `${FOLDER}/${foldername}`;
  const { secure_url } = await cloudinary.uploader.upload(dataURI, { folder });

  return secure_url;
}

export async function deleteFile(foldername: string) {
  const folder = `${FOLDER}/${foldername}`;
  if (!(await isFolderExist(folder))) return;

  await cloudinary.api.delete_resources_by_prefix(folder);
  await cloudinary.api.delete_folder(folder);
}

async function isFolderExist(folder: string) {
  try {
    await cloudinary.api.resources_by_asset_folder(folder);
    return true;
  } catch {
    return false;
  }
}

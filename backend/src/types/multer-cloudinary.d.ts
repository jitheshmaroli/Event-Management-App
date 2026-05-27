export interface CloudinaryFile extends Express.Multer.File {
  cloudinaryPublicId?: string;
  cloudinaryUrl?: string;
}

import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function saveBufferToFile(buffer, filename) {
  await fs.writeFile(filename, buffer);
  return filename;
}

export default async function sticker(buffer, { animated = false } = {}) {
  const tmpDir = path.join(process.cwd(), 'tmp');
  await fs.mkdir(tmpDir, { recursive: true });

  const inputPath = path.join(tmpDir, `${Date.now()}-input`);
  const ext = animated ? '.mp4' : '.jpg';
  const outputPath = path.join(tmpDir, `${Date.now()}-output${animated ? '.webm' : '.webp'}`);

  await saveBufferToFile(buffer, inputPath + ext);

  let cmd;
  if (animated) {
    cmd = `ffmpeg -i "${inputPath + ext}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=30" -c:v libvpx-vp9 -b:v 500K -an -loop 0 "${outputPath}"`;
  } else {
    cmd = `ffmpeg -i "${inputPath + ext}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 1 -qscale 80 -preset default -an -vsync 0 "${outputPath}"`;
  }

  await execAsync(cmd);

  const outputBuffer = await fs.readFile(outputPath);

  await fs.unlink(inputPath + ext);
  await fs.unlink(outputPath);

  return outputBuffer;
}

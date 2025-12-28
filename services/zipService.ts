
import JSZip from 'jszip';
import { ProjectData, ProjectFile } from '../types';

export const parseZipFile = async (file: File): Promise<ProjectData> => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const files: ProjectFile[] = [];

  const promises = Object.keys(contents.files).map(async (path) => {
    const zipEntry = contents.files[path];
    if (!zipEntry.dir) {
      const content = await zipEntry.async('string');
      // Only include relevant code files to save tokens
      const extension = path.split('.').pop()?.toLowerCase();
      const relevantExtensions = ['js', 'jsx', 'ts', 'tsx', 'json', 'css', 'html', 'md'];
      
      if (relevantExtensions.includes(extension || '')) {
        files.push({ path, content });
      }
    }
  });

  await Promise.all(promises);

  return {
    name: file.name,
    files: files.slice(0, 50) // Limit to first 50 files for API safety
  };
};

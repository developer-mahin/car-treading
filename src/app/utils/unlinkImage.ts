import fs from 'fs';

const unlinkImage = async (file: string) => {
  let result;
  try {
    fs.unlink(file, (err) => {
      if (err) throw err;
      result = `Deleted ${file}`;
    });
    return result;
  } catch (err) {
    return err;
  }
};

export default unlinkImage;

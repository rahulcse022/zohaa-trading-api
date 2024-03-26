const multer = require('multer');
const ftps = require('ftps');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    console.log(file,'File')
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ limits:{fileSize:1000000} });
const uploadFileToFtp = async (localFilePath, remoteFilePath, ftpConfig)=> {
  // const client = new FTP();
  const client = new ftps(ftpConfig)
  try {
    // await client.access(ftpConfig);
    // await client.uploadFrom(localFilePath, remoteFilePath);
    const res1 = await client.cd(remoteFilePath); // Change to the remote directory
    const res2 = await client.put(localFilePath);
    console.log(res1, 'Res 1');
    console.log(res2, 'Res 2')
    console.log('File uploaded to FTP server successfully............', remoteFilePath);
  } catch (error) {
    console.error('Error uploading file to FTP:', error);
  } finally {
    // await client.disconnect();
  }

  try {
   const file =  await client.cd(remoteFilePath); // Change to the remote directory
   const file2 =  await client.get(localFilePath); // Fetch the file
    console.log('File fetched from FTPS server successfully');
    console.log(file,'File fetch1 ')
    console.log(file2, 'File fetch2')
  } catch (error) {
    console.error('Error fetching file from FTPS:', error);
  } finally {
    // client.disconnect(); // Disconnect from the FTP server
  }
}

module.exports = {upload, uploadFileToFtp};
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


// cloudinary configuration
cloudinary.config({
	cloud_name: 'dxjxl1rsy',
	api_key: '524434749391688',
	api_secret: '7iooRqHMBjdWk8kY-HaQdAS6lhI'
});



export const uploadCloud = async (path: any) => {
	const result = await cloudinary.uploader.upload(path, { resource_type: 'auto' })
	return result;
}


const imageStorage = multer.diskStorage({
	destination: './image',
	filename: (req: any, file: any, cb: any) => {
		let filename = Date.now() + "--" + file.originalname;
		cb(null, filename.replace(/\s+/g, ''))
	}
});




export const upload = multer({
	storage: imageStorage,
})





export const arrayBufferToBase64 = (buffer: any) => {
	const bytes = new Uint8Array(buffer);
	const base64 = Buffer.from(bytes).toString('base64');
	return base64;
}


export const delAll = () => {
	fs.readdir("./image", (err: any, files: any) => {
		if (err) throw err;

		for (const file of files) {
			fs.unlink(`./image/${file}`, (err: any) => {
				if (err) throw err;
			});
		}
	});
}

export const base64ToFile = async (base64String: any, filePath: any) => {
	const data = Buffer.from(base64String, 'base64');
	fs.appendFileSync(filePath, data);
	const result = await uploadCloud(filePath);
	delAll()
	return result;
}
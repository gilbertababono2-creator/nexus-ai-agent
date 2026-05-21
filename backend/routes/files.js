
import express from 'express';
import admin from 'firebase-admin';

const router = express.Router();


router.post('/upload', async (req, res) => {
  const bucket = admin.storage().bucket();
  try {
    const { userId, fileName, fileData } = req.body;
    const buffer = Buffer.from(fileData, 'base64');
    const file = bucket.file(`users/${userId}/${Date.now()}_${fileName}`);
    await file.save(buffer, { contentType: 'application/octet-stream' });
    const url = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    res.json({ url: url[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

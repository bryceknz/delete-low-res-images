# delete-low-res-images
I wrote this script 📜 to automate deleting 💀 images 🖼️ under a given resolution. I took a data dump 💾 of all of my Google Photos content from 2016 when I went travelling 🥾 and uploaded all my images 📸 in "Original Resolution". Not wanting to increase this quota 💸, or lose the full-res versions of my images, I decided to backup 📥 what I could, then [recover my storage space](https://support.google.com/drive/answer/6374270?authuser=0).

To use this script, simply replace the values for `directory` and `resolutionLimit` in `index.js`, then run `npm start`. All files equal to or under the `resolutionLimit` (in megapixels) will be deleted.

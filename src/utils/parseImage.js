export default function parseImage(file, cb) {
  if (!file) return;
  if (file.type.split("/")[0] != "image") return;
  const fr = new FileReader();
  if (cb) {
    fr.onloadend = function () {
      cb(fr.result);
    };
    fr.readAsDataURL(file);
  } else
    return new Promise(function (resolve, reject) {
      fr.onloadend = function () {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
}

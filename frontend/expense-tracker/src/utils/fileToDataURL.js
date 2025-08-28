export const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result); // 'data:image/jpeg;base64,...'
    r.onerror = reject;
    r.readAsDataURL(file);
  });

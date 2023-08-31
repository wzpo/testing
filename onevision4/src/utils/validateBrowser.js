export default function validateBrowser () {
  let support;

  let userAgent = navigator.userAgent;
  console.log(userAgent);

  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    // 'Opera';
    support = false;
  } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
    // 'IE';
    support = false;
  } else if (userAgent.indexOf('Edge') > -1) {
    // 'Edge';
    support = false;
  } else if (userAgent.indexOf('Firefox') > -1) {
    // 'Firefox';
    support = false;
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    // 'Safari';
    support = false;
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
    // 'Chrome';
    support = true;
  } else {
    // 'Unkonwn';
    support = false;
  }
  return support;
}

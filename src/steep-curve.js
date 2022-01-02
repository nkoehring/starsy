// Thank you Ingo for your tremendous help with this one.

// This function returns a steep curve from [minX,0] to [infinity,maxY]
// inc is tuned for x-values between minX and minX+100 describing a gentle curve
export default function steepCurve (x, minX, maxY, inc=0.01) {
  // f(x) = maxY * (1 - e^(-(inc*x)+minX*inc))
  return maxY * (1 - Math.E ** (-(inc*x) + minX*inc))
}

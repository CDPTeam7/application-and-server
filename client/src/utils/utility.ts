export function stringifyNumber(num: number) {
  // add comma before iteration of digit with three time.
  return num.toString().replace(/(\B)(?=(\d{3})+(?!\d))/g, ",");
}

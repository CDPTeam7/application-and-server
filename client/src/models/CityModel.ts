const districtData:Record<string, string[]> = {
  "대구": [
    "북구", "수성구", "달서구",
  ],
  "서울": [
    "강남구", "강북구", "구로구", "강서구", "서초구", "강남구", "강북구", "구로구", "강서구", "서초구"
  ],
}; // DB로 부터 가져온다고 가정.

// 매번 DB로 쿼리로 가져오는게 아니라, 캐시로 저장할 수 있어야함.

const district:Map<string, string[]> = new Map();

Object.keys(districtData).forEach((value) => {
  if(!districtData[value]) return;
  district.set(value, districtData[value]);
});

export const getCityList = () => Array.from(district.keys());

export const getDistrictList = (city:string) => {
  if(!district.has(city)) return null;
  return district.get(city);
}